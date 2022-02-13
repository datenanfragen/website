{
    "title": "Honey, the data hoarder—request a copy of your data now!",
    "type": "act",
    "date": "2020-11-02T14:43:34+02:00",
    "tags": [ "addon", "data request", "history data", "data collection", "browser history" ],
    "featured_image": "honey.jpg",
    "authors": [ "malte", "baltpeter" ],
    "notices": "Photo adapted after: \"[Busy bees](https://unsplash.com/photos/StEaRc1xQV4)\" by [Boba Jaglicic](https://unsplash.com/@bobajaglicic) ([Unsplash license](https://unsplash.com/license))",
    "has_sva_finder": true
}

In our {{< link slug="blog/honey-data-collection" text="investigation on Honey" >}}, we have shown that the browser extension collects their users' data on a large scale. Regardless of whether an account has been registered or not, the add-on diligently logs page views on plenty of websites and sends them to the company behind the extension, {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, a US company that was [bought by PayPal](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

{{< featuredImg alt="Photo of a lot of bees that rush to a drop of sugar water, above that the text: “Honey, the data hoarder—request your data now”" >}}

## What should I do?

Did you use Honey and maybe weren't aware of this data hoarding? Or do you simply want to know what Honey has saved about you? The GDPR grants you a number of {{< link slug="your-gdpr-rights" text="rights regarding your personal data" >}}, including the right to request a free copy of all data a company has collected <!-- stored? --> about you, the {{< link slug="your-gdpr-rights#right-of-data-access" text="**right of data access**" >}}.

If you feel Honey violated your rights after inspecting the data they have stored on you and you want to file a complaint with the data protection authorities, you can use the template at the end of this article.

## How can I request my data?

We have already prepared the necessary request that you can use to demand a copy of your data from Honey Science LLC, the US-based company behind the browser extension. There are two forms on this page: Use the first one if you have used Honey with an account or the second one if you have used it [without an account](#used-Honey-without-an-account).

Afterwards, you can send the email using your own email program or webmailer. This way, everything you type into this page can be processed **locally on your device**. That means we will never see your data.

Honey Science LLC has a month to answer your request after you sent the email. They can extend that deadline by another two months if they have good reasons, but they have to tell you that within a month. If you decide that Honey shouldn't keep your data after receiving their response you can use your {{< link slug="your-gdpr-rights#right-to-be-forgotten" text="**right to be forgotten**" >}} and make a request to demand the immediate deletion of your data. You can use our {{< link slug="generator#!company=joinhoney" text="generator" >}} <!-- TODO: set request type to DELETE when the generator supports this--> for that as well.

## Used Honey with an account?

You only have to enter your name, email and "Honey Gold" balance and you can already send your request via email—free of charge of course.

You can view your Honey Gold balance [here](https://www.joinhoney.com/honeygold/overview).

<div id="act-with-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}

## Used Honey without an account?

You've used Honey without creating an account? They have still collected your history data. To request it, you have to identify yourself with two IDs that Honey keeps on you.

Enter your name, email, and both IDs into the form below and you are ready to send your data request!

### Find your two IDs

Finding the two IDs (*userId* and *deviceId*) is unfortunately a little complicated, but it shouldn't be too hard if you follow this guide.

We have to look into the so-called "local storage" of the Honey extension. That is a place in your browser where pages and extensions can save data. You might have heard of cookies, local storage is similar.
The process for accessing Honey's local storage is different from browser to browser, so we have written two guides: One for Firefox and one for Chrome.

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

<div id="act-no-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}
<script>
window.addEventListener('load', function() {
    renderActWidget("act-with-account", {
        text_before_dynamic_input_container: "You’ve used Honey with an account? Use this form.",
        request_types: ['access'],
        transport_medium: 'email',
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
    });
    renderActWidget("act-no-account", {
        text_before_dynamic_input_container: "You've used Honey without an account? Use this form.",
        request_types: ['access'],
        transport_medium: 'email',
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
    });
});
</script>

## How can I file a complaint about this?

The GDPR gives you the right to file a complaint against a company with the {{< link slug="supervisory-authorities" text="supervisory authorities" >}}.
Filing a complaint is free.
Your complaint should describe, if applicable, that you requested your data from Honey and that you think, after you've read their response, that they have violated your privacy rights. You might illustrate that with examples from Honey's data export.

The responsible authority will check your complaint and if they determine a misconduct on Honey's side they might instruct them to cease that activity or even impose a fine.

The authorities need some time to process your complaint, especially if the company is in another country than you.

You can use this tool to find the authority responsible for you: 

<div class="sva-finder"></div>
{{< noScript "noscript-sva" >}}
<script>
    window.props = { override: { country: { de: 'debralda' } } };
    window.addEventListener('load', function() { renderSvaFinder(); });
</script>

We also prepared a complaint template for you to use. Modify it according to your situation: Fill in the curly brackets, check if the parts in square brackets are suitable. Don't forgot to include the referenced ATTACHMENT.

<div class="blog-letter">
Artichoke hearts Thai sun pepper hemp seeds pineapple salsa balsamic vinaigrette summer fruit salad peach strawberry mango creamy cauliflower alfredo sauce coriander mediterranean vegetables smoky maple tempeh glaze edamame hummus golden cayenne pepper. Tofu apple vinaigrette strawberry spinach salad thyme strawberry mango smoothie cool off plums cinnamon udon noodles burritos kimchi overflowing. Dark and stormy grapefruit green onions asian pear portobello mushrooms lemon red lentil soup ginger tofu cinnamon toast lime mango crisp kale.

Banh mi salad rolls peppermint cilantro lime vinaigrette roasted peanuts potato crunchy naga viper bite sized tasty lime. Elderberry sweet potato black bean burrito spicy lemon guacamole sleepy morning tea matcha Malaysian ultra creamy avocado pesto dill ginger lemongrass agave green tea. 
</div>


---

**Updates**:

We have made the following changes to this article since the initial publication:

- February 2022: We restructured the article and added the complaint template and reference to it.
