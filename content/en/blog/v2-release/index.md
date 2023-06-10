{
    "title": "datarequests.org v2: Refreshed interface and complaint generator",
    "type": "blog",
    "date": "2022-12-07T17:00:00+02:00",
    "description": "Yesterday, we released the next version of our website with many improvements: A new interface for the request generator, more comprehensive request history, a fancy new homepage and a generator for complaints and admonitions.",
    "featured_image": "refreshed-interface-and-complaint-generator",
    "tags": [ "complaint generator", "new user experience", "update", "open source" ],
    "authors": [ "zner0L" ],
    "notices": "Photo adapted after: “[red and white stocking photo](https://unsplash.com/photos/coXB9EFuWWg)” by [Markus Spiske](https://unsplash.com/@markusspiske) ([Unsplash license](https://unsplash.com/license))"
}

In an old Christian tradition, German children get presents and candy in their shoes on the morning of the 6th of December. Yesterday, we put something else into your shoes: The new release of our websites with many great new features! We spent a lot of time in the last few months to update the user interface and took great care to make it as easy and accessible as possible to send requests to companies and other data controllers. Thanks to the [Prototype Fund](https://prototypefund.de/en/) run by the [Open Knowledge Foundation Germany](https://okfn.de/en/) and funded by the [German Federal Ministry of Education and Research](https://www.bmbf.de/bmbf/en/home/home_node.html), who gave a grant to Lorenz and Benni, we were able to put more time than usual into this release (read more in our {{< link slug="verein/transparency#12-external-grants-that-members-have-received" text="transparency information" >}}). Now we are just really excited and proud to present you all the new features. If you want to take a look at the code, you can [find all changes on GitHub](https://github.com/datenanfragen/website/pull/921).

{{< featuredImg alt="Stylized photo with a blue tint of stockings hanging in a room, on it the text: „Refreshed interface and complaint generator“" >}}

## Multi-page request generator

We completely redesigned the generator flow to make it less cluttered and also easier to send lots of requests to different companies. While we are keeping the old one-page-generator up at {{< link slug="/g" text="/g" >}} for those who prefer it, in the new interface, we split the request generation process into several pages and we guide you through the process of sending your requests. In the company selection phase, we also now recommend packs of companies that collect the data of lots of people, so that new users have it easier to start requesting. In the next step, you can now also choose what sub-entities of the controller you want to include in your request and select whether you want to enquire about tracking and don't know how the controller can identify you.

{{< img name="multi-page-generator-en" alt="Screenshot of three pages of the multi-page-generator (from left to right): the first image shows the request type choosing page listing the options “Get access to data about me.”, “Delete (parts of) data about me.”, “Correct data about me.” and “Stop receiving direct marketing”. The second image shows the company choosing page with a search bar on top and several suggested company packs under it, with the titles: “Social media and communication”, “Entertainment”, “Finance” and “Telecommunication”. The third image show the identification data page with several input fields asking for identification data for “Datenanfragen.de e. V.“ such as name, email address and address. Under the input fields, there is a button to send the request." caption="Three pages of the new generator: The request type chooser, the company search and the view for filling in your identification data." >}}

## Comprehensive request history

If you use our website regularly, you might be familiar with the “My requests” page. If you didn't disable it in the {{< link slug="/privacy-controls" text="privacy controls" >}}, we save all the requests you sent in your browser and give you an overview of them. Up until now, this was just a pretty convoluted table, but for years we wanted to improve upon it and rebuild it as a proper request management page. In our new release, we create a proceeding for each of your requests which holds all messages you sent relating to it, including admonitions and complaints. You can add information about messages you received from the controller, so you have it all in one place if you need to send a complaint. We save the state of all requests, so you know your current progress, and we remind you with a badge on all pages if there are requests overdue you should send an admonition for.  

{{< img name="my-requests" alt="Screenshot of the “My requests” page. Under the explanation text, there are several requests with different states, such as “Action needed”, “Overdue” and “Done”. One request is expanded showing two messages, one from the user and one from the requested company." caption="The new request history on the “My requests“ page." >}}

## Complaint generator & request reactions

The new “My requests” page shines even more when used in combination with the feature we are most proud of: Based on the history of your request, we offer you the option to “react”. If you choose to do so, we help you assess what missteps a controller might have taken by asking you some questions and then generate an admonition or even a proper complaint from your answers. While we want to be clear that we are no lawyers and can't offer help in specific cases, we do hope this makes it easier for you to actually complain to the authorities. You are not alone with being overwhelmed by controller replies anymore.

{{< img name="complaint-generator" alt="Screenshot of the admonition generator. On top, it shows the question “Has there been a problem with your request?” and below that are several buttons featuring different kinds of problems. One example of a button text: “Company has not answered yet.”" caption="First page of the admonition generator" >}}

## Clean homepage

Another thing we had on our wish list for years was to enhance our homepage that never really seemed to fit what we do. Now we guide users to the generator with clear calls-to-action and give a short overview of how it works. Even for experienced users it might be worthwhile to visit the home page once in a while: You can react to your overdue requests right from the home page with our new reminder widget and we show you the newest blog articles.

{{< img name="homepage" alt="Screenshot of the homepage. It features the top bar with the menu and a badge showing the number of overdue requests (two) and below that a widget saying: “You have 2 overdue requests. React now or mark them as satisfactory.”. Below that is our claim: “You have a right to privacy!” and four buttons for the request types like in the generator." caption="Our new homepage showing the reminder widget." >}}

## Refactoring: TypeScript, zustand and other improvements

Under the hood (in the code), we also changed a lot. Some of the changes have already been released in last few months. We switched to [TypeScript](https://www.typescriptlang.org/) to catch bugs early (and girl did we catch some) and now use [zustand](https://github.com/pmndrs/zustand) for state management in the hope that this will prevent race condition bugs in the code. This also means that we moved your old saved requests into a new form of storage. We hope everything went well, but if you encountered any problems and/or are missing any requests, [drop us an email](mailto:dev@datenanfragen.de). Furthermore, we cleaned up the code quite a bit and got rid of a lot of old and dysfunctional corners of it. And we now release a [packaged version of our generator](https://www.npmjs.com/package/@datenanfragen/components) that you can plug into your own code, e.g. if you want to embed it into your own website.

## Help wanted: Bug reports, suggestion packs and translations

Now that we released the new features, we need your help: We tried to test everything thoroughly, but sometimes a bug still slips through. So if you encounter any, please send us a bug report, either via our error modal or by sending an email to [dev@datenanfragen.de](mailto:dev@datenanfragen.de). Also, lots of strings changed or have been newly added to our translations. If you want to contribute by translating a few of them [via Weblate](https://hosted.weblate.org/projects/datenanfragen-de/website/), that would be really great! Finally, we can only recommend companies for countries we have suggestion packs for. If you think you have a good overview of what companies regularly process data in a country, add a company pack into [our database](https://github.com/datenanfragen/data#company-packs) (please provide comprehensive sources).
