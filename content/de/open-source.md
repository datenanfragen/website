{
	"title": "Open Source",
	"type": "page",
	"aliases": ["opensource", "oss", "foss"],
	"heading": "<span style='text-align: center; font-family: monospace;'>Datenanfragen.de <span class='color-red-600' title='liebt'>❤</span> Open Source</span>"
}

<img id="open-source-humaaan" class="top-left-humaaan" src="/img/humaaans/open-source.svg">

Open Source steht im Kern von Datenanfragen.de. Wir haben das Projekt von Grund auf konzipiert, so offen wie möglich zu sein. So verpflichtet uns nicht zuletzt unsere [Satzung]({{< ref "verein/constitution" >}}), unsere Inhalte unter freien Lizenzen zur Verfügung zu stellen.

Wir sind große Verfechter von Open Source und fest davon überzeugt.

## Unsere Open Source-Repositories

Hier findest Du eine Übersicht einiger wichtiger Repositories, die direkt oder indirekt für Datenanfragen.de erstellt wurden und die selbstverständlich unter freien Lizenzen stehen. Wir laden Dich herzlich ein, hinter die Kulissen zu schauen, mitzuarbeiten und unsere Arbeit für Deine Projekte weiter zu verwenden! Wir freuen uns über Issues und Pull Requests in den Repositories.

<!-- TODO: Weitere Repos hinzufügen, sobald diese soweit sind. -->

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/datenanfragen/website"><img class="image" src="/card-icons/code.svg" alt="website"></a></div>
    <div class="padded col75">
        <a href="https://github.com/datenanfragen/website"><h1><code>website</code></h1></a>
        <span class="license">MIT License</span>
        <p class="description">
            Die Webseite, auf der Du gerade bist. In diesem Repository findest Du nicht nur den gesamten Inhalt, sondern auch den Code für die Generator, die Datenschutzeinstellungen und vieles mehr.
            <br>Die Seite ist überwiegend statisch ausgelegt und basiert auf Hugo und Preact.
        </p>
    </div>
<div class="clearfix"></div>
<a class="button button-primary read-more-button" href="https://github.com/datenanfragen/website">Zum Repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/datenanfragen/data"><img class="image" src="/card-icons/database.svg" alt="data" style="width: 70%;"></a></div>
    <div class="padded col75">
        <a href="https://github.com/datenanfragen/data"><h1><code>data</code></h1></a>
        <span class="license">CC0</span>
        <p class="description">
            Die Daten hinter dem Projekt. Hier findest Du nicht nur unsere Unternehmens- und Aufsichtsbehördendatenbanken, sondern auch die Musterbriefe.
            <br>Das Repository ist als Ansammlung von Plaintextdateien strukturiert, so ist es sowohl menschen- als auch maschinenlesbar.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/datenanfragen/data">Zum Repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/datenanfragen/verein"><img class="image" src="/card-icons/group.svg" alt="verein"></a></div>
    <div class="padded col75">
        <a href="https://github.com/datenanfragen/verein"><h1><code>verein</code></h1></a>
        <p class="description">
            Wir wollen auch unseren Mutterverein, den Datenanfragen.de e.&nbsp;V. so offen und transparent wie möglich gestalten. Deshalb findest Du in diesem Repository wichtige Dokumente komplett mit Änderungshistorie.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/datenanfragen/verein">Zum Repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/zner0L/postcss-fonticons"><img class="image" src="/card-icons/icon-font.svg" alt="postcss-fonticons" style="width: 60%;"></a></div>
    <div class="padded col75">
        <a href="https://github.com/zner0L/postcss-fonticons"><h1><code>postcss-fonticons</code></h1></a>
        <span class="license">MIT License</span>
        <p class="description">
            Ein Plugin für PostCSS, welches die automatische Generierung von Icon-Fonts mit den verwendeten Icons ermöglicht.
            <br>Adaptiert vom <a href="https://github.com/jantimon/iconfont-webpack-plugin">Icon Font Webpack Plugin</a> von Jan Nicklas.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/zner0L/postcss-fonticons">Zum Repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<article class="list-article icon-list-article">
    <div class="col25 article-featured-image"><a href="https://github.com/baltpeter/yace"><img class="image" src="/card-icons/speech-bubble.svg" alt="yace"></a></div>
    <div class="padded col75">
        <a href="https://github.com/baltpeter/yace"><h1><code>yace</code></h1></a>
        <span class="license">MIT License</span>
        <p class="description">
            Ein Framework zum einfachen und flexiblen Deployment von Kommentarfunktionen für beliebige Inhalte. Das Backend wird dabei kostengünstig über AWS gehostet.
            <br>Das Framework ist von Grund auf entwickelt, um den Datenschutz der Nutzer_innen weitmöglichst zu garantieren.
        </p>
    </div>
    <div class="clearfix"></div>
    <a class="button button-primary read-more-button" href="https://github.com/baltpeter/yace">Zum Repository&nbsp;<span class="icon icon-arrow-right"></span></a>
</article>

<a id="contributors"></a>
## Mitwirkende

Herzlichen Dank an alle, die etwas zu Datenanfragen.de beigetragen haben! Ohne Euch wäre das Projekt nicht möglich.

<div class="box box-info" style="white-space: pre;">
    {{< authors >}}
</div>

Falls Du auch zu dem Projekt beigetragen hast, aber noch nicht in der Liste erscheinst, würden wir uns freuen, wenn Du Dich in die [`AUTHORS`-Datei](https://github.com/datenanfragen/website/blob/master/AUTHORS) einträgst.

<a id="license-notices"></a>
## Open Source-Projekte, die wir einsetzen

Ganz im Sinne des Ganzen schaffen wir nicht nur einige eigene Open Source-Projekte, sondern setzen natürlich auch zahlreiche für unsere Arbeit ein.

Wir sind stolz, die folgenden Projekte für die Webseite verwenden zu dürfen. Herzlichen Dank an jede Autor_in, die sich entschlossen hat, seine_ihre wertvolle Arbeit zur Verfügung zu stellen!

Die vollständigen Lizenzinformationen für alle Projekte, die wir nutzen, findest Du [hier]({{< absURL "NOTICES.txt" >}}).

<div class="box box-info">
    {{< attribution "von" >}}
</div>
