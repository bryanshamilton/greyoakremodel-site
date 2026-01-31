interface Env {
  GOOGLE_PLACES_API_KEY: string;
  GOOGLE_PLACE_ID: string;
}

interface GoogleReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url?: string;
}

interface GooglePlaceDetails {
  result: {
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, s-maxage=86400, max-age=3600', // Edge cache 24h, browser 1h
  };

  // Check if required env vars are set
  if (!env.GOOGLE_PLACES_API_KEY || !env.GOOGLE_PLACE_ID) {
    return new Response(
      JSON.stringify({
        error: 'Google Places API not configured',
        reviews: [],
        rating: 0,
        totalReviews: 0
      }),
      { status: 200, headers }
    );
  }

  try {
    // Fetch from Google Places API
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', env.GOOGLE_PLACE_ID);
    url.searchParams.set('fields', 'reviews,rating,user_ratings_total');
    url.searchParams.set('key', env.GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json() as GooglePlaceDetails;

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const result = {
      reviews: data.result.reviews || [],
      rating: data.result.rating || 0,
      totalReviews: data.result.user_ratings_total || 0,
    };

    return new Response(JSON.stringify(result), { headers });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch reviews',
        reviews: [],
        rating: 0,
        totalReviews: 0
      }),
      { status: 200, headers }
    );
  }
};
