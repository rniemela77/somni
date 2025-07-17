<template>
    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="card-body">
                        <h1 class="mb-4 fw-bold">Privacy Policy</h1>
                        <p class="text-muted mb-4">Last updated: July 17, 2025</p>

                        <h2 class="mb-4 fw-bold">Somni (Personality Analyzer) Privacy Policy</h2>

                        <h3>1. Introduction</h3>
                        <p>Welcome to Somni. We respect your privacy and are committed to protecting your
                        personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                        information when you use our mobile application (the "Service").</p>

                        <h3>2. Information We Collect</h3>

                        <h4>Google Account Information</h4>
                        <p>When you log in using Google Single Sign-On, we receive your name,
                        email address, and profile picture URL.</p>

                        <h4>Personality Questionnaire Responses</h4>
                        <p>You'll answer questions like “How often do you like going out?” by
                        selecting vague, non'identifying options (e.g., “rarely,” “sometimes,” “often”). We store your
                        responses, but never any directly identifying information alongside them.</p>

                        <h4>Payment Data</h4>
                        <p>If you upgrade to Premium, payments are processed through Stripe. We only receive
                        a payment token and subscription status; we do not store or view your full payment card data.</p>

                        <h4>Usage & Analytics Data</h4>
                        <p>We collect technical information (e.g., device type, operating system
                        version, crash reports, Firebase analytics events, IP address) to understand app usage and
                        improve performance.</p>

                        <h3>3. How We Use Your Information</h3>

                        <p>To Provide and Maintain the Service: Authenticate you via Google SSO, manage your subscription
                        status, and deliver personalized AI-generated insights based on your questionnaire answers.</p>

                        <p>To Improve the Service: Analyze usage patterns and crash reports to fix bugs and enhance
                        features.</p>

                        <p>To Communicate With You: Send important account or security notices, subscription receipts, and
                        support responses.</p>

                        <p>For AI Analysis: We transmit your questionnaire responses (without your name or email) to
                        OpenAI's API to generate personalized personality insights.</p>

                        <h3>4. Information Sharing & Disclosure</h3>
                        <p>We do not sell or rent your personal data. We share only as necessary with:</p>

                        <ul>
                            <li>Google: For authentication and basic profile data.</li>
                            <li>Stripe: For payment processing and subscription management.</li>
                            <li>OpenAI: To analyze your anonymized questionnaire responses and generate insights.</li>
                            <li>Firebase & Other Service Providers: Hosting, analytics, and crash-reporting services, all bound
                        by strict confidentiality requirements.</li>
                            <li>Legal Requirements: If required by law or to protect our rights (e.g., to comply with a
                        subpoena).</li>
                        </ul>

                        <h3>5. Data Retention</h3>
                        <p>We retain your Google profile data, questionnaire responses, and subscription records as long as
                        your account is active. If you delete your account or request deletion, we will permanently
                        erase your data from our systems within 30 days, unless retention is required by law.</p>

                        <h3>6. Security</h3>
                        <p>We implement industry-standard security measures, including encryption in transit (HTTPS/TLS),
                        encryption at rest, firewall protections, and access controls, to safeguard your data against
                        unauthorized access, alteration, or disclosure.</p>

                        <h3>7. Your Rights</h3>
                        <p>Depending on your jurisdiction, you may have the right to:</p>

                        <ul>
                            <li>Access or receive a copy of your personal data.</li>
                            <li>Correct or update inaccurate data.</li>
                            <li>Delete your data (“right to be forgotten”).</li>
                            <li>Object to or restrict certain processing activities.</li>
                            <li>Withdraw consent where we rely on it.</li>
                        </ul>

                        <h3>8. Children's Privacy</h3>
                        <p>Our Service is not intended for children under 13. We do not knowingly collect personal data
                        from minors. If you believe we've collected information from a child under 13, please contact us
                        to have it removed.</p>

                        <h3>9. International Transfers</h3>
                        <p>Your data may be processed and stored in the United States or other countries where our service
                        providers operate. By using the Service, you consent to the transfer of your data to
                        jurisdictions with different privacy laws.</p>

                        <h3>10. Changes to This Privacy Policy</h3>
                        <p>We may update this policy to reflect changes in our practices or applicable laws. When we do,
                        we'll update the "Last updated" date and post the new policy here. Continued use of the Service
                        after any changes signifies your acceptance of the updated policy.</p>

                        <h3>11. Contact Us</h3>
                        <p>If you have questions or concerns about this Privacy Policy, please contact:</p>
                        <p>Email: <a href="mailto:rvniemela@hotmail.com">rvniemela@hotmail.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.container {
    max-width: 1200px;
}

h1 {
    color: var(--bs-primary, #0d6efd);
}

.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

section:not(:last-child) {
    border-bottom: 1px solid #f8f9fa;
    padding-bottom: 1.5rem;
}

section:not(:first-child) {
    padding-top: 1.5rem;
}

ul {
    padding-left: 1.5rem;
}

li {
    margin-bottom: 0.5rem;
}

.h4 {
    color: var(--bs-dark, #212529);
}

.h5 {
    color: var(--bs-secondary, #6c757d);
}
</style>