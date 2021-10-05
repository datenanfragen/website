{
    "title": "Hacktoberfest 2021: Hack with us!",
    "type": "blog",
    "date": "2021-09-29T18:51:03+02:00",
    "description": "We are again participating in the Hacktoberfest! Contribute and get a webcam cover, sticker set and maybe a free t-shirt.",
    "featured_image": "hacktoberfest-2021",
    "tags": [ "hacktoberfest", "digitalocean", "github", "open source", "pull request" ],
    "authors": [ "malte", "baltpeter" ],
    "notices": "Photo adapted after: \"[maple leaves photo](https://unsplash.com/photos/Pu-en3ew8wY)\" by [Fey Marin](https://unsplash.com/@feymarin) ([Unsplash license](https://unsplash.com/license))"
}

~~Party time!~~ October and therefore the Hacktoberfest are back! We are participating again and are looking forward to your contributions. Just like in previous years, we are happy to give away some goodies as well.

{{< featuredImg alt="Written in front of leaves: \"Hacktoberfest 2021: Hack with us!\"" >}}

Just like the [original Hacktoberfest](https://hacktoberfest.digitalocean.com/) from DigitalOcean, we want to get people excited about Open Source software and contributing to it. That means for you: Contribute to datarequests.org or one of our websites in another language, and we'll give you some goodies: The first 100 people get a useful webcam cover and a sticker pack. The ten best contributions will receive a t-shirt as well! All that is completely free for you, we will even pay for postage.

Our project and our goal to make privacy and the GDPR accessible to many users is driven by community contributions. We are especially looking forward to contributions in areas we cannot cover ourselves, like translations from English or German to other languages that are spoken in EU countries, see [this entry](https://github.com/datenanfragen/data/issues/229) in our issue tracker. Or do you know about [companies that collect data about every citizen of a specific EU country](https://github.com/datenanfragen/data/issues/230)? Tell us about it, to help us recommend the right companies to users in that country!

Use the [form below](#registration-form) to register for our event via GitHub. Please note that we are not affiliated with DigitalOcean's Hacktoberfest and that this is a completely separate event. You can also contribute without GitHub by writing us an email to <hacktoberfest@datenanfragen.de> with an attached git patch, as explained below.

## What are the rewards?

The first 100 participants who submit a pull request or a patch that is accepted by us to one of the [qualifying repositories](#repos) between October 1, 2021 and November 1, 2021, will get a free webcam cover and a free sticker set.

In addition, we are awarding 10 t-shirts for the best contributions. Our board will select those winners after the event is over.

Participating is of course entirely free, we will even pay for international shipping.

<a id="registration-form"></a>

## How do I participate?

Our event is independent from the official Hacktoberfest. If you want to participate, you have to register before November 4, 2021. For the registration, you don't have to provide a shipping address yet. In the interest of data minimization, we will only ask for that after the event, when we are actually shipping the rewards.

If you want to participate using GitHub, please use this form, so we can match your contributions to you:

<noscript><div class="box box-info">Enable JavaScript to get notified if your form was sent successfully.</div></noscript>
<div class="box form-group" style="max-width: 600px; margin: auto;">
<form action="https://backend.datenanfragen.de/hacktoberfest" method="POST">
I want to participate in the Hacktoberfest 2021 event by Datenanfragen.de e.&nbsp;V. using GitHub.
<div class="clearfix" style="margin-bottom: 5px;"></div>
<!-- Pattern adapted after: https://github.com/shinnn/github-username-regex/blob/0794566cc10e8c5a0e562823f8f8e99fa044e5f4/index.js#L1 -->
<label><div class="col40"><strong>GitHub username</strong></div><div class="col60"><input type="text" pattern="^@?[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$" name="github_user" class="form-element" required></label></div>
<div class="clearfix" style="margin-bottom: 5px;"></div>
<label><div class="col40"><strong>Email address</strong></div><div class="col60"><input type="email" name="email" class="form-element" required></label></div>
<div class="clearfix"></div>
<div class="form-group"><input type="checkbox" id="accept_terms" name="accept_terms" class="form-element" required><label for="accept_terms"><div style="float: left; width: 90%;">I have read the <a href="https://static.dacdn.de/docs/conditions-hacktoberfest-2021.pdf">conditions of participation and privacy policy</a>. I accept the terms and agree to the processing of my data for the purpose of this Hacktoberfest event.<sup class="color-teal-700">*</sup></div></label></div>
<div class="form-group"><input type="checkbox" id="accept_us_transfers" name="accept_us_transfers" class="form-element" required><label for="accept_us_transfers"><div style="float: left; width: 90%;">For my participation, I want to use the US platform GitHub (<a href="https://docs.github.com/en/github/site-policy/github-privacy-statement">privacy policy</a>), for which the organizer cannot guarantee the same level of data protection as in the EU. There is a risk that my data may be subject to access by US authorities, and I may not have effective legal remedies. I agree to this.<sup class="color-teal-700">*</sup></div></label></div>
<input type="hidden" name="language" value="en">
<input type="hidden" name="year" value="2021">
<div style="float: right; margin-top: 10px;"><input class="button button-primary" type="submit" value="Register"></label></div>
<div class="clearfix"></div>
</form>
</div>

You can also participate without using GitHub. To do so, please email us at <hacktoberfest@datenanfragen.de>. The email has to indicate your desire to participate in the event and your agreement to the [conditions of participation and privacy policy](https://static.dacdn.de/docs/conditions-hacktoberfest-2021.pdf). It also has to contain at least one Git patch.

By the way: If you _also_ want to participate in the official Hacktoberfest, you have to [register separately](https://hacktoberfest.digitalocean.com/). That is however **not** necessary to participate in our event.

<a id="contrib-ideas"></a>

## Do you have any suggestions on what to contribute?

<img class="offset-image offset-image-right" src="/card-icons/code.svg" height="150px" width="190px" style="height: 150px; margin-right: -100px; margin-top: -50px;" alt="">

If you're new to Datenanfragen.de, you may be a little overwhelmed and not know where to start. Don't worry: There are numerous areas in which you can participate—regardless of whether you have experience with programming and data protection or not. To make it easier for you to get started, we have put together a few suggestions here. You can find many more tasks in the issues of the respective [repositories](#repos). Of course, we also welcome your own ideas on how you could improve the project.

* **Helping with the code**  
  A key part of the project is the [website](https://github.com/datenanfragen/website). Are you missing a feature you want to implement or do you want to fix a bug? We are looking forward to your contribution!  
  If you need some inspiration, have a look at our [GitHub issues](https://github.com/datenanfragen/website/issues).

* **Adding required elements to company records**  
  Companies have to be able to identify you to respond to your GDPR requests. However, different companies require different methods of identification. That's why we collect the required identification elements for companies in our company database.

  As we only have this data for some companies, we default to name, email, and address for many companies. But those fields aren't optimal for all companies—some require more, some less data. That's where we need your help: [This GitHub issue](https://github.com/datenanfragen/data/issues/720) explains in detail how you can add the missing data by sending your own GDPR requests to the corresponding companies. As a side effect, you'll also learn something about the data those companies process on you.

* **Collecting suggested companies for more countries**  
  As explained above, we want to collect lists of companies that users should request their data from. We need these lists to suggest those companies to users in these countries via our wizard. At the moment, we support Germany, Austria, and Great Britain. However, we would like to support all EU countries in the future. Read more in [this GitHub issue](https://github.com/datenanfragen/data/issues/230).

* **Writing and translating blog posts**  
  We already have a number of posts in our {{< link slug="blog" text="blog" >}}. They cover a wide spectrum, from explanations of GDPR topics to tutorials and reports. We want to publish more articles and are happy about fitting submissions to the [website repository](https://github.com/datenanfragen/website). 

  Another important task is translating existing posts into the other languages that we support. The [website repository](https://github.com/datenanfragen/website) is the right place to go for that, as well. The following issues list the pages to translate for each language: [French and Croatian](https://github.com/datenanfragen/website/issues/489), [French](https://github.com/datenanfragen/website/issues/457), [Portuguese (pages)](https://github.com/datenanfragen/website/issues/455), [Portuguese (blog posts)](https://github.com/datenanfragen/website/issues/456), [Spanish](https://github.com/datenanfragen/website/issues/695), [Croatian (pages)](https://github.com/datenanfragen/website/issues/697) and [Croatian (blog posts)](https://github.com/datenanfragen/website/issues/696).

* **Translating the request templates to more languages**  
  Our request templates are already available in many languages, but some are outdated, as we have since updated the English and German templates. Help us by translating these updates to other languages as well. Learn more in [this GitHub issue](https://github.com/datenanfragen/data/issues/229). There you'll also learn how to translate the templates to even more languages.

<a id="repos"></a>

## Which repositories qualify for the event?

For the event, we count pull requests and patches to following repositories as valid contributions:

* <https://github.com/datenanfragen/website>
* <https://github.com/datenanfragen/data>
* <https://github.com/datenanfragen/backend>
* <https://github.com/datenanfragen/company-json-generator>
* <https://github.com/datenanfragen/letter-generator>
* <https://github.com/datenanfragen/media>
* <https://github.com/datenanfragen/locate-contacts-addon>
* <https://github.com/zner0L/postcss-fonticons>
* <https://github.com/datenanfragen/data-imports>

We may also accept additional repositories. If you think that your contribution to another repository will help the project, please contact us beforehand at <hacktoberfest@datenanfragen.de> and ask if we will also count those contributions.

## Any questions?

If you have any questions, feel free to email us at <hacktoberfest@datenanfragen.de> or write a comment here. If you need help or guidance working with our project and repositories, ask away! The best place for specific questions are the corresponding GitHub issues.

Happy hacking!

<script>
window.onload = function() {
  if (PARAMETERS.error) {
    if (PARAMETERS.error === 'validation') alert('The data you entered was incorrect. Please try again.');
    else if (PARAMETERS.error === 'server') alert('Our server encountered an error while processing your registration. Please try again in a little while or contact hacktoberfest@datenanfragen.de.');
    else if (PARAMETERS.error === 'duplicate') alert('This GitHub user or email has already been registered. This wasn\'t you? Please contact us at hacktoberfest@datenanfragen.de.');
    else if (PARAMETERS.error === 'expired') alert('Unfortunately, the registration deadline has already expired.');
  }
  else if (PARAMETERS.success === '1') alert('Your registration was processed successfully. You should receive an email confirmation soon.');
}
</script>
