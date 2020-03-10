{
	"title": "Open Source",
	"type": "page",
	"aliases": ["opensource", "oss", "foss"],
	"heading": "<span style='text-align: center; font-family: monospace;'>datarequests.org <span class='color-red-600' title='loves'>❤</span> Open Source</span>"
}

<img id="open-source-humaaan" class="top-left-humaaan" style="margin-top: -70px;" src="/img/humaaans/open-source.svg">

Open Source is at the very core of datarequests.org. We have designed the project from the ground up to be as open as possible. Our [constitution]({{< ref "verein/constitution" >}}) requires us to publish our content under free licenses.

We are huge proponents of Open Source and believe in it.

## Our Open Source repositories

Here is an overview of important repositories that we have created—directly or indirectly—for datarequests.org. They are of course published under free licenses. We invite you to take a look behind the curtain, contribute or use our work for your own projects! We warmly welcome issues and pull requests through the repositories.

<!-- TODO: Add new repos when applicable. -->

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/datenanfragen/website"><img class="image" src="/card-icons/code.svg" alt="website"></a></div>
    <div class="padded col75">
        <a href="https://github.com/datenanfragen/website"><h1><code>website</code></h1></a>
        <span class="license">MIT License</span>
        <p class="description">
            The website you are currently on. This repository not only contains the content but also the code for the generator, the privacy controls and more.
            <br>The site is designed to be primarily static and runs on Hugo and Preact.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/datenanfragen/website">View repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/datenanfragen/data"><img class="image" src="/card-icons/database.svg" alt="data" style="width: 70%;"></a></div>
    <div class="padded col75">
        <a href="https://github.com/datenanfragen/data"><h1><code>data</code></h1></a>
        <span class="license">CC0</span>
        <p class="description">
            The data behind the project. This includes our company and supervisory authority databases but also the sample letters.
            <br>The repository is structured as a collection of plain text files that are both human- and machine-readable.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/datenanfragen/data">View repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/datenanfragen/verein"><img class="image" src="/card-icons/group.svg" alt="verein"></a></div>
    <div class="padded col75">
        <a href="https://github.com/datenanfragen/verein"><h1><code>verein</code></h1></a>
        <p class="description">
            We also want to run the non-profit behind this project, Datenanfragen.de e.&nbsp;V., as openly and transparently as possible. Thus, this repository contains important documents with their change histories.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/datenanfragen/verein">View repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/zner0L/postcss-fonticons"><img class="image" src="/card-icons/icon-font.svg" alt="postcss-fonticons" style="width: 60%;"></a></div>
    <div class="padded col75">
        <a href="https://github.com/zner0L/postcss-fonticons"><h1><code>postcss-fonticons</code></h1></a>
        <span class="license">MIT License</span>
        <p class="description">
            A PostCSS plugin that allows you to create your icon font on the fly, including only the icons that are actually used.
            <br>Adapted after Jan Nicklas’ <a href="https://github.com/jantimon/iconfont-webpack-plugin">Icon Font Webpack Plugin</a>.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/zner0L/postcss-fonticons">View repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/baltpeter/yace"><img class="image" src="/card-icons/speech-bubble.svg" alt="yace"></a></div>
    <div class="padded col75">
        <a href="https://github.com/baltpeter/yace"><h1><code>yace</code></h1></a>
        <span class="license">MIT License</span>
        <p class="description">
            A simple, privacy-focussed and easy-to-deploy engine to build custom comment solutions, hosted on AWS.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/baltpeter/yace">View repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<a id="contributors"></a>
## Contributors

A huge thanks to everyone contributing to datarequests.org! The project wouldn't be possible without you.

<div class="box box-info" style="white-space: pre;">
    {{< authors >}}
</div>

If you have also contributed but your name isn't on the list yet, we invite you to add it to the [`AUTHORS` file](https://github.com/datenanfragen/website/blob/master/AUTHORS).

<a id="license-notices"></a>
## Open Source projects used by us

In keeping with the spirit of Open Source, we not only maintain our own Open Source projects but also make heavy use of others for our work.

We are proud to be able to use the following projects for this website. Huge thanks to the authors who have decided to enable others to use their valuable work!

You may find the full license notices for all projects we use [here]({{< absURL "NOTICES.txt" >}}).

<div class="box box-info">
	{{< attribution "by" >}}
</div>
