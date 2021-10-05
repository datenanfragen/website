{
    "title": "We are also participating in the Hacktoberfest 2020",
    "type": "blog",
    "date": "2020-09-30T11:55:42+02:00",
    "description": "This year, we are once again participating in the Hacktoberfest. If you contribute to datarequests.org, we will you will get a free sticker set. In addition, we are awarding the ten best contributions with an exclusive t-shirt.",
    "featured_image": "hacktoberfest-2020",
    "tags": [ "hacktoberfest", "digitalocean", "github", "open source", "pull request" ],
    "authors": [ "baltpeter" ],
    "notices": "Photo adapted after: \"[people doing office works](https://unsplash.com/photos/QBpZGqEMsKg)\" by [Alex Kotliarskyi](https://unsplash.com/@frantic) ([Unsplash license](https://unsplash.com/license))"
}

It's that time again: The [Hacktoberfest](https://hacktoberfest.digitalocean.com/) 2020 is coming up, as always hosted by the hosting provider DigitalOcean. The aim is to get people excited about working on open source software as usual. The Hacktoberfest invites you to submit pull requests to open source projects during October 2020. Those who submit four or more pull requests will receive a t-shirt from DigitalOcean as a gift or can plant a tree.

{{< featuredImg alt="Hacktoberfest 2020 + Datenanfragen.de e. V." >}}

It has almost become a tradition for other companies to participate in addition to this official event and to offer their own rewards for contributions to their respective open source projects.  
After the great success of our participation last year, we are pleased to announce that we will again participate in the Hacktoberfest this year. datarequests.org loves {{< link slug="/open-source" text="open source" >}} and the people who contribute to the project are very important to us. That's why we will reward contributions to the project that are submitted during October 2020 as a pull request via [GitHub](https://github.com/) or as a patch via email. Find out more in this post.

## What are the rewards?

The first 100 participants who submit a pull request or a patch that is accepted by us to one of the [qualifying repositories](#repos) between October 1, 2020 and November 1, 2020, will get a free sticker set.

In addition, we are awarding 10 t-shirts for the best contributions. Our board will select those winners after the event is over.

Participating is of course entirely free, we will even pay for shipping.

## How do I participate?

Our event is independent of the official Hacktoberfest. If you want to participate, you have to register before November 4, 2020. For the registration, you don't have to provide a shipping address yet. In the interest of data minimization, we will only ask for that after the event, when we are actually shipping the rewards.

If you want to participate using GitHub, please use this form, so we can match your contributions to you:

<div class="box form-group" style="max-width: 600px; margin: auto;">
<form action="https://backend.datenanfragen.de/hacktoberfest" method="POST">
I want to participate in the Hacktoberfest 2020 event by Datenanfragen.de e.&nbsp;V. using GitHub.
<div class="clearfix" style="margin-bottom: 5px;"></div>
<!-- Pattern adapted after: https://github.com/shinnn/github-username-regex/blob/0794566cc10e8c5a0e562823f8f8e99fa044e5f4/index.js#L1 -->
<label><div class="col40"><strong>GitHub username</strong></div><div class="col60"><input type="text" pattern="^@?[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$" name="github_user" class="form-element" required></label></div>
<div class="clearfix" style="margin-bottom: 5px;"></div>
<label><div class="col40"><strong>Email address</strong></div><div class="col60"><input type="email" name="email" class="form-element" required></label></div>
<div class="clearfix"></div>
<div class="form-group"><input type="checkbox" id="accept_terms" name="accept_terms" class="form-element" required><label for="accept_terms"><div style="float: left; width: 90%;">I have read the <a href="https://static.dacdn.de/docs/conditions-hacktoberfest-2020.pdf">conditions of participation and privacy policy</a> and accept them.<sup class="color-teal-700">*</sup></div></label></div>
<div class="form-group"><input type="checkbox" id="accept_us_transfers" name="accept_us_transfers" class="form-element" required><label for="accept_us_transfers"><div style="float: left; width: 90%;">For my participation, I want to use the US platform GitHub (<a href="https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-privacy-statement">privacy policy</a>), for which the organizer cannot guarantee the same level of data protection as in the EU. There is a risk that my data may be subject to access by US authorities, and I may not have effective legal remedies. I agree to this.<sup class="color-teal-700">*</sup></div></label></div>
<input type="hidden" name="language" value="en">
<input type="hidden" name="year" value="2020">
<div style="float: right; margin-top: 10px;"><input class="button button-primary" type="submit" value="Register"></label></div>
<div class="clearfix"></div>
</form>
</div>

You can also participate without using GitHub. To do so, please send us an email to <hacktoberfest@datenanfragen.de>. The email has to indicate your desire to participate in the event and your agreement to the [conditions of participation and privacy policy](https://static.dacdn.de/docs/conditions-hacktoberfest-2020.pdf). It also has to contain at least one Git patch.

By the way: If you _also_ want to participate in the official Hacktoberfest, you have to [register separately](https://hacktoberfest.digitalocean.com/). That is however **not** necessary to participate in our event.

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

We may also accept additional repositories. If you think that your contribution to another repository will help the project, please contact us beforehand at <hacktoberfest@datenanfragen.de> and ask if we will also count those contributions.

## Do you have any suggestions on what to contribute?

<img class="offset-image offset-image-right" src="/card-icons/code.svg" style="height: 150px; margin-right: -100px; margin-top: -50px;" alt="">

If you're new to Datenanfragen.de, you may be a little overwhelmed and don't know where to start. Don't worry: There are numerous areas in which you can participate—regardless of whether you have experience with programming and data protection or not. To make it easier for you to get started, we have put together a few suggestions here. You can find many more tasks in the issues of the respective repositories. Of course we also welcome your own ideas on how you could improve the project.

* **Adding new records for the company database**  
  The {{< link slug="/company" text="company database" >}} is at the core of our project. We collect the contact details for privacy-related questions to companies and other organizations. By now, we have collected a fair number of records but of course, tons more are still missing. As such, we always welcome new company records that are submitted as pull requests.  
  A small hint: Our [company JSON generator](https://company-json.netlify.com/) makes this process a lot easier. Please also read our [guidelines on how to create company records](https://github.com/datenanfragen/data#data-format-guidelines-and-resources-for-company-records).

* **Collecting suggested companies for more countries**  
  The request wizard on our homepage suggests a number of companies (depending on the country) that users should definitely send requests to. At the moment, we only support Germany, Austria, and Great Britain. However, we would love to support all EU countries. Find out how you can help with that in [this GitHub issue](https://github.com/datenanfragen/data/issues/230).

* **Add required elements to company records**  
  If you send a GDPR request, the company needs to be able to identify you using data that differs from company to company. Therefore, we also collect the lists of these elements in our database.

  Currently, we are still missing this entry for many of the companies, forcing the generator to fallback to the default fields (name, email, and address). But those aren't appropriate for all companies. This is where we need your help: [This GitHub issue](https://github.com/datenanfragen/data/issues/720) explains in detail how you can add the missing data by sending your own GDPR requests to the corresponding companies. As a side effect, you'll also learn something about the data those companies process on you.

* **Writing and translating blog post**  
  Our {{< link slug="blog" text="blog" >}} has posts on many data protection-releated topics, including explanations of the GDPR rights and how to use them, comments on current events, and guides. We would like to offer even more posts. Please submit new posts to the [website repository](https://github.com/datenanfragen/website).

  Another important task is translating those posts into the other languages that we support. The [website repository](https://github.com/datenanfragen/website) is the right place to go for that, as well.

* **Translating the request templates to more languages**  
  Our request templates are already available in many languages but we would like to support all EU languages. Learn more in [this GitHub issue](https://github.com/datenanfragen/data/issues/229).

* **Helping with the code**  
  A key part of the project is the [website](https://github.com/datenanfragen/website). There's a feature you want to implement or a bug you want to fix? We are looking forward to your contribution!  
  If you need some inspiration, have a look at our [GitHub issues](https://github.com/datenanfragen/website/issues).

## Any questions?

If you have any questions, just send us an email to <hacktoberfest@datenanfragen.de> or leave a comment here. We'll also gladly help if you have problems or need some help finding your way around our repositories. In these cases, leaving a comment in the corresponding issue is the best course of action.

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
