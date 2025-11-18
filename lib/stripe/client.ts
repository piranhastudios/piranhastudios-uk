export const createCheckoutSession = async (packageData: {
  name: string;
  price: string;
  description: string;
  features: string[];
}) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ packageData }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }

    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};