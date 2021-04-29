{
    "title": "Thank you for your donation!",
    "type": "thanks",
    "aliases": ["verein/thanks"]
}

<img class="top-right-humaaan" src="/img/humaaans/thanks.svg" alt="A big heart floating next to a person.">

Thank you so much for your donation! It really helps us continue running our website free for everyone in the future and also to start new project for data protection in Europe. You can read about what exactly will happen with your donation in our {{< link slug="verein/transparency" text="yearly reports" >}}.

If you would like to regularly support us or you just want to be more involved, you can also {{< link slug="verein/become-a-member" text="become a member" >}}.

## Where is my donation receipt?

We will of course happily issue a receipt for your donation. **Please note however that we are only accredited as a charitable organization by the German tax authorities.** Please check your local tax code to see how and if you can deduct your donation to us in your tax returns.

If you donated less than 300 €, the German tax offices will also accept a [simplified donation receipt](https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf) in combination with your payment receipt (bank statement, credit card invoice, …) for your tax deduction.

For larger donations, you will need a donation receipt in the official form. You can get one of these from us of course, but we do need your address for that. Please send us an email at [vorstand@datenanfragen.de](mailto:vorstand@datenanfragen.de) (you can encrypt it with [this key](/pgp/62A7EC35.asc)) with your address and donation ID or the reference of your bank transfer. 

<a id="request-donation-verification-button" class="button button-secondary icon icon-email" href="mailto:spenden@datenanfragen.de">Request donation receipt</a>
<a class="button button-secondary icon icon-download" href="https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf">Download simplified donation receipt</a>

{{< script >}}
window.onload = function () {
    var donation_reference = window.PARAMETERS.donation_reference;
    if(donation_reference) {
        document.getElementById('request-donation-verification-button').setAttribute('href', encodeURI('mailto:vorstand@datenanfragen.de?' +
            'Subject=Donation receipt request (donation #' + donation_reference + ')' +
            '&Body=Hi,\n\nPlease send me the donation receipt for my donation #' + donation_reference + '.\n' +
            'Please send it to my address:\n\n\nBest regards,\n'
        ));
    }
};
{{< /script >}}
