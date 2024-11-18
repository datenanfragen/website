{
    "title": "Honey, the data hoarder—request a copy of your data now!",
    "type": "act",
    "date": "2020-11-02T14:43:34+02:00",
    "last_edited": "2022-02-26T19:55:04+02:00",
    "tags": [ "addon", "data request", "history data", "data collection", "browser history" ],
    "featured_image": "honey.jpg",
    "authors": [ "malte", "baltpeter" ],
    "notices": "Photo adapted after: \"[Busy bees](https://unsplash.com/photos/StEaRc1xQV4)\" by [Boba Jaglicic](https://unsplash.com/@bobajaglicic) ([Unsplash license](https://unsplash.com/license))",
    "has_sva_finder": true
}

In our {{< link slug="blog/honey-data-collection" text="investigation on Honey" >}}, we have shown that the browser extension collects their users’ data on a large scale. Regardless of whether an account has been registered or not, the add-on diligently logs page views on plenty of websites and sends them to the company behind the extension, {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, a US-based company that was [bought by PayPal](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

{{< featuredImg alt="Photo of a lot of bees rushing to a drop of sugar water, above that the text: “Honey, the data hoarder—request your data now”" >}}

## What should I do?

Did you use Honey and maybe weren't aware of this data hoarding? Or do you simply want to know what Honey has saved about you? The GDPR grants you a number of {{< link slug="your-gdpr-rights" text="rights regarding your personal data" >}}, including the right to request a free copy of all data a company has collected <!-- stored? --> about you, the {{< link slug="your-gdpr-rights#right-of-data-access" text="**right of data access**" >}}. In this post, we'll explain how you can use this right with Honey.

And if you feel Honey violated your rights after inspecting the data they have stored on you and you want to file a complaint with the data protection authorities, we'll explain how that works [at the end of the article](#complaint).

## How can I request my data?

We have already prepared the necessary request that you can use to demand a copy of your data from Honey Science LLC. The exact steps you need to take depend on whether you have used Honey [with](#used-honey-with-an-account) or [without](#used-honey-without-an-account) an account. We have prepared a form that generates the request email for both cases.

Afterwards, you can send this email using your own email program or webmailer. This way, everything you type into this page stays **locally on your device**. That means, we will never see your data.

Honey has a month to answer your request after you sent the email. They can extend that deadline by another two months if they have good reasons, but they have to tell you that within the first month. If you decide that Honey shouldn't keep your data after receiving their response, you can additionally use your {{< link slug="your-gdpr-rights#right-to-be-forgotten" text="**right to be forgotten**" >}} and make a request to demand the immediate deletion of your data. You can use our {{< link slug="generator#!company=joinhoney" text="generator" >}} <!-- TODO: set request type to DELETE when the generator supports this--> for that.

## Used Honey with an account?

If you've used Honey with an account, you only have to enter your name, email and "Honey Gold" balance and you can already send your request via email—free of charge of course.

You can view your Honey Gold balance [here](https://www.joinhoney.com/honeygold/overview).

<div id="act-with-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}

## Used Honey without an account?

You've used Honey without creating an account? They have still collected your history data. To request it, you have to identify yourself with two IDs that Honey has assigned to you.

### Find your two IDs

Finding the two IDs (*userId* and *deviceId*) is unfortunately a little complicated, so we've compiled a guide with screenshots that explains the process in detail.

We have to look into the so-called "local storage" of the Honey extension. That is a place in your browser where pages and extensions can save data. You might have heard of cookies, local storage is similar.

The process for accessing Honey's local storage is different from browser to browser. We'll show you how it works for both Firefox and Chrome:

<div class="box box-info">
<details open>
    <summary>🦊 Firefox</summary>
    <div class="slides">
        <div class="slider">
            <div class="slide" id="slide-ff-1">
                {{< img name="ff_en_typing_about_debugging" alt="“about:debugging” was typed into Firefox’ address bar.">}}
                <p>Type <code>about:debugging</code> into the address bar and hit Enter. You are taken to an internal Firefox page.</p>
                <div>
                    <a class="button button-secondary button-right" href="#slide-ff-2">Next <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ff-2">
                {{< img name="ff_en_about_debugging" alt="“This Firefox” on the “about:debugging” page is framed in red.">}}
                <p>Click on “This Firefox”.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ff-1"><span class="icon-arrow-left"></span> Back</a>
                    <a class="button button-secondary button-right" href="#slide-ff-3">Next <span class="icon-arrow-right"></span></a> 
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ff-3">
                {{< img name="ff_en_about_debugging_honey" alt="A list of installed Firefox extensions on the “about:debugging” page. “Inspect” next to Honey is framed in red.">}}
                <p>Click the “Inspect” button next to Honey. A new page called “Toolbox” opens.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ff-2"><span class="icon-arrow-left"></span> Back</a>
                    <a class="button button-secondary button-right" href="#slide-ff-4">Next <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ff-4">
                {{< img name="ff_en_localstorage" alt="Honey’s toolbox tab is open. “Storage”, “Local Storage” and the deviceId and userId are highlighted.">}}
                <p>Pick the tab “Storage”, then “Local Storage” on the left and finally the element that appears below, starting with <code>moz-extension://</code>. Now you can read and copy the <code>deviceId</code> and <code>userId</code> from the table on the right.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ff-3"><span class="icon-arrow-left"></span> Back</a>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</details>
</div>

<div class="box box-info" style="margin: 15px 0;">
<details>
    <summary>Chrome</summary>
    <div class="slides">
        <div class="slider">
            <div class="slide" id="slide-ch-1">
                {{< img name="ch_en_extensions.png" alt="“chrome://extensions” was typed into Chrome’s address bar.">}}
                <p>Type <code>chrome://extensions</code> into the address bar and hit Enter. You are taken to an internal Chrome page.</p>
                <div>
                    <a class="button button-secondary button-right" href="#slide-ch-2">Next <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ch-2">
                {{< img name="ch_en_dev_on" alt="The “Developer mode” switch in the upper-right corner is turned on and highlighted in red.">}}
                <p>Enable the developer mode using the switch in the upper-right corner.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ch-1"><span class="icon-arrow-left"></span> Back</a>
                    <a class="button button-secondary button-right" href="#slide-ch-3">Next <span class="icon-arrow-right"></span></a> 
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ch-3">
                {{< img name="ch_en_honey" alt="A list of installed Chrome extensions on the “chrome://extensions” page. “background page” next to Honey is framed in red.">}}
                <p>Click on “background page” next to Honey. A new window called “DevTools” opens.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ch-2"><span class="icon-arrow-left"></span> Back</a>
                    <a class="button button-secondary button-right" href="#slide-ch-4">Next <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ch-4">
                {{< img name="ch_local_storage" alt="Honey’s DevTools are opened, “Application”, “Local Storage” and the deviceId and userId are highlighted.">}}
                <p>Click on the “Application” tab in the new “DevTools” window. You might have to resize the window to see the button.
                Click on “Local Storage” on the left and on the now shown element that starts with <code>chrome-extension://</code>. Now you can see and copy the <code>deviceId</code> and <code>userId</code> from the table on the right.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ch-3"><span class="icon-arrow-left"></span> Back</a>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</details>
</div>

Enter your name, email, and both IDs into the form below and you are ready to send your data request!

<div id="act-no-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}
<script>
window.addEventListener('load', function() {
    renderActWidget({
        textBeforeDynamicInputContainer: "You’ve used Honey with an account? Use this form.",
        requestTypes: ['access'],
        transportMedium: 'email',
        company: {
            "slug": "joinhoney",
            "relevant-countries": [
                "all"
            ],
            "name": "Honey Science LLC",
            "runs": [
                "Honey Savings Finder (Browser extension)",
                "Honey Gold"
            ],
            "address": "963 E. 4th Street\nLos Angeles\nCA 90013\nUnited States of America",
            "email": "privacy@joinhoney.com",
            "web": "https://www.joinhoney.com/",
            "sources": [
                "https://www.joinhoney.com/privacy"
            ],
            "required-elements": [
                {
                    "desc": "Name",
                    "type": "name",
                    "optional": false
                },
                {
                    "desc": "Email",
                    "type": "email",
                    "optional": false
                },
                {
                    "desc": "Honey Gold balance",
                    "type": "input",
                    "optional": false
                }
            ],
            "suggested-transport-medium": "email",
            "quality": "tested"
        }
    }, "act-with-account");
    renderActWidget({
        textBeforeDynamicInputContainer: "You've used Honey without an account? Use this form.",
        requestTypes: ['access'],
        transportMedium: 'email',
        company: {
            "slug": "joinhoney",
            "relevant-countries": [
                "all"
            ],
            "name": "Honey Science LLC",
            "runs": [
                "Honey Savings Finder (Browser extension)",
                "Honey Gold"
            ],
            "address": "963 E. 4th Street\nLos Angeles\nCA 90013\nUnited States of America",
            "email": "privacy@joinhoney.com",
            "web": "https://www.joinhoney.com/",
            "sources": [
                "https://www.joinhoney.com/privacy"
            ],
            "required-elements": [
                {
                    "desc": "Name",
                    "type": "name",
                    "optional": false
                },
                {
                    "desc": "Email",
                    "type": "email",
                    "optional": false
                },
                {
                    "desc": "userId",
                    "type": "input",
                    "optional": false
                },
                {
                    "desc": "deviceId",
                    "type": "input",
                    "optional": false
                }
            ],
            "suggested-transport-medium": "email",
            "quality": "tested"
        }
    }, "act-no-account");
});
</script>

## How can I file a complaint about this? {#complaint}

The GDPR also gives you the right to file a complaint against a company with the {{< link slug="blog/supervisory-authorities" text="supervisory authorities" >}} if you believe they have violated your data protection rights. Filing a complaint is free and you can of course also do that for Honey.

A complaint can be filed informally, you don't have to adhere to any specific guidelines. If you want to complain about Honey, your complaint should describe, if applicable, that you requested your data from Honey and that you think, after you've read their response, that they have violated your privacy rights. You should illustrate that with examples from Honey's data export.  
We have prepared a template that you can use as a guide.

Modify it according to your situation: Fill in the <span class="blog-letter-fill-in">curly brackets</span>, and check if the parts in [square brackets] are applicable to your situation (remove them otherwise). And don't forgot to attach all referenced documents. You can (and should) of course also change any other aspects of the template to better suit your situation where necessary. 

<div class="blog-letter" style="margin-bottom: 20px;">
<details>
<summary>Complaint template (click here to expand)</summary>
<p>To Whom It May Concern:</p>

<p>I am hereby lodging a complaint according to Article 77 GDPR against the following controller:
Honey Science LLC
963 E. 4th Street
Los Angeles, CA 90013
USA</p>

<p>I am a user of the Honey browser extension (https://www.joinhoney.com), which is run by Honey Science LLC (hereinafter: “Honey”; details taken from: https://www.joinhoney.com/privacy). [I have created an account with Honey and signed into the browser extension with that.] [I have used the browser extension without creating an account.]</p>

<p>On <span class="blog-letter-fill-in">enter the date of your access request here</span>, I sent an access request according to Art. 15 GDPR to privacy@joinhoney.com (the privacy contact listed in the privacy policy: https://www.joinhoney.com/privacy).</p>

<p>Honey provided me with my data on <span class="blog-letter-fill-in">enter the date of Honey’s reply here</span>. I was sent, among other files, a “PageViews.csv” file, which lists pages I have visited with my browser. In total, it has <span class="blog-letter-fill-in">enter number of lines in the file here</span> lines. As this file contains a lot of private data about me, as I am going to argue in the following, I have not attached it but will only quote parts of it. [Should you need the file for the investigation, I am however willing to provide it.]</p>

<p>Here are some example of lines from “PageViews.csv”:</p>

<p><span class="blog-letter-fill-in">list a few lines from the file here</span></p>

<p>Each entry contains at least the following information:</p>

<p>
* timestamp of when I visited the respective site<br>
* multiple unique IDs identifying myself, my session, and my device<br>
* details about my browser<br>
* geolocation data, probably inferred from my IP address<br>
* the full URL of the respective page
</p>

<p>Honey&#39;s privacy policy (https://www.joinhoney.com/privacy) says (under “What data we collect and why”):</p>

<p>
> “Honey does not track your search engine history, emails, or your browsing on any site that is not a retail website (a site where you can shop and make a purchase). When you are on a pre-approved retail site, to help you save money, Honey will collect information about that site that lets us know which coupons and promos to find for you. […]<br>
> Shopping and Usage Data.<br>
> On retail sites, Honey collects the name of the retailer, page views, and in some cases, product information that allows us to track price changes and update our product catalog. […]<br>
> […]<br>
> What data we do not collect<br>
> We collect information that we believe can help us save our users time and money. This does not include, and we do not collect, any information from your search engine history, emails, or from websites that are not retail sites.”
</p>

<p>However, contrary to those statements, Honey does indeed collect data from non-“retail sites”, including for example [login pages, blog posts, order information pages, help/support pages, video streaming sites, and forums]. In my “PageViews.csv” file, they for example collected the following non-retails page visits:</p>

<p><span class="blog-letter-fill-in">list a few URLs from the file that are not from shopping sites here</span></p>

<p>According to the privacy policy (https://www.joinhoney.com/privacy), Honey wants to base this processing on Art. 6(1)(a) or (f) GDPR (“When you consent to our use of your data for a specific purpose.”, “When Honey has a legitimate interest in using that data in the normal ways you&#39;d expect, like ensuring Honey&#39;s products run properly, improving and creating new products, historical analytics research, promoting Honey, and protecting our legal rights.”).</p>

<p>As far as the processing is supposedly based on Art. 6(1)(a) GDPR, I deny the existence of “freely given, specific, informed and unambiguous” (Art. 4(11) GDPR) consent by me. [I have never consent to Honey&#39;s data processing.] [After the installation of the browser extension, Honey displayed the following notice: “We’re committed to your privacy. It’s always been our mission to find you the best deals. We only collect data when you’re on shopping sites. That way, we can find you relevant coupons, share accurate pricing trends, and continue to make shopping better for our community. You can read our founders’ commitment to privacy here (https://www.joinhoney.com/privacy). You can always come back and adjust your settings at any time”. When registering for an account, I had to check “I have read and agree to the Honey Terms of Service (https://www.joinhoney.com/terms) and Privacy Policy (https://www.joinhoney.com/privacy). I understand that to continue, PayPal will share name and email address with Honey.” Thus, any supposed consent was based on incorrect statements by Honey right from the beginning (as I explained, Honey does collect data on non-shopping pages). In addition, it was not possible to complete the registration without checking the checkbox. It was thus not possible to deny consent. And finally, I was only allowed to consent to the privacy policy as a whole instead of to discrete purposes. As a result, despite Honey forcing me to click the checkbox, no valid consent came to be (cf. “Guidelines 05/2020 on consent under Regulation 2016/679” by the EDPB: https://edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202005_consent_en.pdf).]</p>

<p>As far as the processing is supposedly based on Art. 6(1)(f) GDPR, I deny the existence of a legitimate interest by Honey that overrides my interests or fundamental rights and freedoms. Here, one has to distinguish between data on shopping sites and data on other sites. For the latter, a legitimate interest cannot possibly be assumed. This data has no relation to the Honey browser extension and it definitely wasn&#39;t forseeable for me that Honey would collect this data. [When I saw Honey&#39;s reply to my access request, I was genuinely shocked at how comprehensively and deliberately they had collected my browser history data.]
For data on shopping sites, Honey might have a legitimate interest. But even here, it is questionably whether the processing is proportionate and reasonable given the vast amount of data collected and the fact that it is stored without a time limit (“Honey only [sic] retains information about you as long as you keep using Honey”, from: https://www.joinhoney.com/privacy).</p>

<p>I thus have to assume that Honey processed my data without a valid legal basis. That is why I am lodging this complaint with you. Please check this practice by the controller and, if necessary, to prohibit Honey from this unlawful processing. I would also ask you to consider imposing a fine.
[You may pass on my data to the controller for the purpose of processing the complaint]. I have attached my described correspondence with Honey to this complaint.</p>

<p>If you need any more details, please feel free to contact me. You can reach me <span class="blog-letter-fill-in">enter your contact details here</span>.</p>

<p>Thanks in advance for your help.</p>

<p>Yours sincerely,<br>
<span class="blog-letter-fill-in">enter your name here</span></p>
</details>
</div>

You can use this tool to find the authority responsible for you and their contact details: 

<div class="sva-finder"></div>
{{< noScript "noscript-sva" >}}
<script>
    window.addEventListener('load', function() { window.renderSvaFinder({ override: { country: { de: 'debralda' } }, showTitle: false }); });
</script>

The responsible authority will check your complaint and if they determine a misconduct on Honey's side, they can instruct them to cease that activity or even impose a fine.

Be prepared for this process to take a while. The authorities need will need time to process your complaint, especially if the company is in another country.

---

**Updates**:

We have made the following changes to this article since the initial publication:

- [February 26, 2022](https://github.com/datenanfragen/website/pull/844): Restructured article and added a complaint template and reference to it.
