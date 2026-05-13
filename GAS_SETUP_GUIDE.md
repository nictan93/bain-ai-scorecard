# Google Apps Script & Tracking Setup Guide

This guide explains how to connect your new tracking spreadsheet to the live IA Assessment so that every submission automatically logs to the sheet and sends the correct email.

## What materially changed in the Decision Trees?

You asked why the decision tree mapping documents had to be updated. Here is exactly what changed between your old VF documents and the live code:

1. **Question IDs**: The old VF files used outdated question IDs (like `q3a_formal_valuation`). The live code uses shorter IDs (like `a1_formal_valuation`, `bc1_asking`, `b1` to `b7`). The new MD files reflect the exact IDs your codebase uses.
2. **Intangible Value Track Name**: The old VF files called the track `brand_ip`. The live code correctly calls it `intangible_value`.
3. **CTA Modes**: The old VF files had three CTA modes for Intangible Value (`report_sent_plus_call_link`, `report_sent_only`, `report_sent_only_no_call`). The live code simplifies this to just two: `report_sent_plus_hot_call_link` and `download_report_only`. 
4. **The 10% Offer Rule**: The result page copy rules explicitly restrict the 10% invoice review offer to users who previously completed a formal valuation. This means only `ESOP_A2_PROVIDER_REVIEW_HOT` and `ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM` get the offer. The updated decision tree now explicitly documents this restriction.
5. **Referrer Tracking**: We added documentation for how the `?ref=jessica` tracking works globally across the app.

---

## Step 1: Upload the Excel File

1. Take the `IA_Assessment_Tracking_v4.xlsx` file I just generated for you and upload it to your Google Drive.
2. Open it in Google Sheets.
3. The first tab is named **Submission Log v3**. This is the exact tab the script will look for. It has the correct A–T column headers (ending with `referral_code` and `answers_json`).

## Step 2: Set up the Google Apps Script

1. In your new Google Sheet, click **Extensions > Apps Script** in the top menu.
2. Delete any default code in the editor.
3. Open the `BainSquared_Assessment_Webhook.gs` file from your project folder, copy all the code, and paste it into the Apps Script editor.
4. **Important**: At the top of the script (around line 47), there is a block called `PDF_FILE_IDS`. You need to replace `"REPLACE_WITH_DRIVE_FILE_ID"` with the actual Google Drive file IDs for your 8 PDFs. 
   *(Note: I checked the script and the IDs were currently set to the placeholder. You must fill these in so the script can attach the PDFs to the emails.)*
5. Check lines 39–42 and ensure `SENDER_EMAIL`, `INTERNAL_EMAIL`, and `BOOKING_URL` are correct.
6. Click the **Save** icon (the floppy disk).

## Step 3: Deploy the Webhook

1. In the Apps Script editor, click the blue **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the details:
   - **Description**: `IA Assessment Webhook v4`
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: `Anyone`
4. Click **Deploy**. Google will ask you to authorize access to your Drive and Gmail. Follow the prompts to allow it.
5. Once deployed, copy the **Web app URL** provided.

## Step 4: Link Vercel to the Webhook

1. Go to your Vercel dashboard and open the `bain-ai-scorecard` project.
2. Go to **Settings > Environment Variables**.
3. Add a new variable:
   - **Key**: `GAS_WEBHOOK_URL`
   - **Value**: Paste the Web app URL you copied in Step 3.
4. Save the variable.
5. **Crucial**: You must redeploy your project in Vercel for the new environment variable to take effect. Go to the **Deployments** tab, click the three dots next to your latest deployment, and select **Redeploy**.

## Step 5: Test It

1. Open your live assessment URL.
2. To test the referrer tracking, add `?ref=test_partner` to the end of the URL (e.g., `https://your-domain.com/?ref=test_partner`) and hit Enter.
3. Complete the assessment and submit your email.
4. Check your Google Sheet — a new row should appear in the **Submission Log v3** tab, and column S (`referral_code`) should say `test_partner`.
5. Check your inbox — you should receive the result email with the correct PDF attached.

You are fully set up!
