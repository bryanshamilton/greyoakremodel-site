interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string; // Where to send form submissions
}

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  projectType: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // Check configuration
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    console.error('Contact form not configured: missing RESEND_API_KEY or CONTACT_EMAIL');
    return new Response(
      JSON.stringify({ success: false, error: 'Contact form not configured' }),
      { status: 500, headers }
    );
  }

  try {
    // Parse form data
    const contentType = request.headers.get('content-type') || '';
    let data: ContactForm;

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        city: formData.get('city') as string || undefined,
        projectType: formData.get('project-type') as string,
        message: formData.get('message') as string,
      };
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid content type' }),
        { status: 400, headers }
      );
    }

    // Validate required fields
    if (!data.name || !data.email || !data.projectType || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers }
      );
    }

    // Format email content
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
      ${data.city ? `<p><strong>City:</strong> ${escapeHtml(data.city)}</p>` : ''}
      <p><strong>Project Type:</strong> ${escapeHtml(data.projectType)}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `;

    const emailText = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ''}${data.city ? `City: ${data.city}\n` : ''}Project Type: ${data.projectType}

Message:
${data.message}
    `.trim();

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Grey Oak Remodel <noreply@greyoakremodel.com>',
        to: [env.CONTACT_EMAIL],
        reply_to: data.email,
        subject: `New Inquiry: ${data.projectType} - ${data.name}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send message' }),
      { status: 500, headers }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
