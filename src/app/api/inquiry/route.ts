import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, services, date, location, message } = body

    // Simple server-side validation
    if (!name || !email || !phone || !services) {
      return NextResponse.json(
        { error: 'Missing required field(s)' },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not defined. Logging inquiry data as fallback:', body)
      return NextResponse.json({
        success: true,
        message: 'Inquiry logged (no email sent - Resend API key missing)',
      })
    }

    const resend = new Resend(apiKey)

    const emailContent = `
      <h2>New Inquiry from AV Films Portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Services:</strong> ${services}</p>
      <p><strong>Preferred Date:</strong> ${date || 'Not specified'}</p>
      <p><strong>Location/Venue:</strong> ${location || 'Not specified'}</p>
      <p><strong>Message / Vision:</strong></p>
      <p>${message || 'None'}</p>
    `

    const data = await resend.emails.send({
      from: 'AV Films Portfolio <onboarding@resend.dev>',
      to: 'avfilmsinquiry@gmail.com', // Destination email
      subject: `New Portfolio Inquiry from ${name}`,
      html: emailContent,
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in inquiry submission:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
