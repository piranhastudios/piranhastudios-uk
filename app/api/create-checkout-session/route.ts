import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { packageData } = await request.json();

    if (!packageData || !packageData.name || !packageData.price) {
      return NextResponse.json({ error: 'Package data is required' }, { status: 400 });
    }

    // Extract price amount from string like "£300/month" or "£1,500/month"
    const priceString = packageData.price.replace(/[£,]/g, ''); // Remove £ and commas
    const priceMatch = priceString.match(/(\d+)/); // Extract number
    
    if (!priceMatch) {
      return NextResponse.json({ error: 'Invalid price format' }, { status: 400 });
    }

    const priceAmount = parseInt(priceMatch[1]) * 100; // Convert to pence

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: priceAmount,
            recurring: { 
              interval: 'month',
              interval_count: 1,
            },
            product_data: {
              name: packageData.name,
              description: packageData.description,
              metadata: {
                package_type: packageData.name,
                features: JSON.stringify(packageData.features),
              },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#services`,
      metadata: {
        package_name: packageData.name,
        package_price: packageData.price,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
