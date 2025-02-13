import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY as string);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Fetch the PDF file from the public folder
        const pdfUrl = `https://ugtalfspxwqvvfq1.public.blob.vercel-storage.com/piranhastudios-uk/piranha-studios-digital%20strategy-playboook-2025-h21RUkpE4TMi4UXf59qDcSJSDy1KpH.pdf`;
        const pdfResponse = await fetch(pdfUrl);

        if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
        }

        const pdfBlob = await pdfResponse.blob();
        const pdfBuffer = await pdfBlob.arrayBuffer();
        const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

        const response = await resend.emails.send({
            from: "Jake Ngatchu <jake@piranha-studios.co.uk>",
            to: [email],
            subject: "Your Digital Strategy Guide",
            html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 20px 0;">
                                        <!-- Logo placeholder -->
                                        <img src="https://piranha-studios.co.uk/_next/image?url=%2Fimg%2Flogo.png&w=64&q=75" alt="Piranha Studios Logo" style="max-width: 200px; height: auto;">
                                        <h1 style="margin-bottom: 20px;">Piranha <span style="color: rgb(220 38 38);">Studios</span></h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f0f0f0; padding: 30px; border-radius: 5px;">
                                        <h1 style="color: rgb(220 38 38); margin-bottom: 20px;">Thank You for Your Time</h1>
                                        
                                        <p>Dear Business Owner,</p>
                                        
                                        <p>We truly appreciate you taking a moment to fill out our questionnaire. Your insights are invaluable in helping us understand your business needs better.</p>
                                        
                                        <h2 style="color: rgb(220 38 38); margin-top: 30px;">What's Next?</h2>
                                        
                                        <ol style="padding-left: 20px;">
                                            <li style="margin-bottom: 10px;">We've attached our 2025 Digital Strategy guide. It's full of practical tips to boost your digital presence.</li>
                                            <li style="margin-bottom: 10px;">Our team is ready to chat about your digital strategy. Book a free consultation with us.</li>
                                            <li style="margin-bottom: 10px;">We'll show you how headless systems can make your business more flexible and future-ready.</li>
                                        </ol>
                                        
                                        <div style="text-align: center; margin-top: 30px;">
                                            <a href="#" style="background-color: rgb(220 38 38); color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Book Your Free Consultation</a>
                                        </div>
                                        
                                        <h2 style="color: rgb(220 38 38); margin-top: 30px;">How We Can Help Your Business</h2>
                                        
                                        <p>Based on your answers, we believe we can help you:</p>
                                        
                                        <ul style="padding-left: 20px;">
                                            <li style="margin-bottom: 10px;">Make your website faster and easier to use</li>
                                            <li style="margin-bottom: 10px;">Connect your online tools so they work better together</li>
                                            <li style="margin-bottom: 10px;">Reach more customers across different platforms</li>
                                            <li style="margin-bottom: 10px;">Prepare your business for future tech changes</li>
                                        </ul>
                                        
                                        <p style="margin-top: 30px;">We're excited to help your business grow online. If you have any questions, just reply to this email.</p>
                                        
                                        <p>Best regards,<br>Your Digital Team</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 20px; font-size: 12px; color: #666666;">
                                        © 2023 Your Company Name. All rights reserved.
                                    </td>
                                </tr>
                            </table>
                        </body>`,
            attachments: [
                {
                    filename: "piranha-studios-strategy-guide-2025.pdf",
                    content: pdfBase64,
                    contentType: "application/pdf",
                },
            ],
        });

        if (response.data) {
            return NextResponse.json({ success: true, message: "Email sent successfully!" });
        } else {
            return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
    }
}
