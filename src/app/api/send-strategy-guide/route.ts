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
            html: `<p>Thank you for signing up! Attached is your digital strategy guide.</p>`,
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
