{
    "title": "Honey in Sammelwut – jetzt eine Kopie Deiner Daten anfragen",
    "type": "act",
    "date": "2020-11-02T14:43:34+02:00",
    "last_edited": "2022-02-18T21:33:10+02:00",
    "tags": [ "addon", "datenauskunft", "verlaufsdaten", "datensammlung", "browser-verlauf" ],
    "featured_image": "honey.jpg",
    "authors": [ "malte", "baltpeter" ],
    "notices": "Titelfoto angepasst nach: „[Busy bees](https://unsplash.com/photos/StEaRc1xQV4)“ von [Boba Jaglicic](https://unsplash.com/@bobajaglicic) ([Unsplash-Lizenz](https://unsplash.com/license))",
    "has_sva_finder": true
}

In unserer {{< link slug="blog/honey-data-collection" text="Recherche zu Honey" >}} haben wir aufgedeckt, dass die Browser-Erweiterung reichlich Daten zu Ihren Nutzer_innen sammelt. Unabhängig davon, ob ein Account angelegt wurde oder nicht, protokolliert das Add-on fleißig alle Aufrufe zahlreicher Webseiten und sendet sie an den Betreiber, die {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, ein US-Unternehmen, das vom Bezahlanbieter [PayPal gekauft wurde](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

{{< featuredImg alt="Foto etlicher Bienen, die sich auf Zuckerwasser stürzen, darüber der Text: „Honey in Sammelwut – jetzt Daten anfragen“" >}}

## Was kann ich jetzt tun?

Hast Du Honey genutzt und warst Dir dieser Datensammelei vielleicht nicht bewusst? Oder willst Du einfach wissen, was Honey über Dich gespeichert hat? Die DSGVO gibt Dir eine ganze Reihe an {{< link slug="your-gdpr-rights" text="Rechten im Bezug auf Deine personenbezogenen Daten" >}}, darunter auch das Recht, eine kostenfreie Kopie aller Daten, die ein Unternehmen über Dich gesammelt hat, zu erhalten – das sogenannte {{< link slug="your-gdpr-rights#auskunftsrecht" text="**Auskunftsrecht**" >}}. Hier erklären wir Dir, wie Du das Auskunftsrecht Honey gegenüber geltend machen kannst.

Und falls Du nach der Einsicht in Deine Daten auch der Meinung bist, dass Honey Deine Rechte verletzt hat, kannst Du Dich darüber bei den Aufsichtsbehörden beschweren. Wie das geht, kannst Du [am Ende dieses Artikels](#beschwerde) nachlesen.

## Wie kann ich meine Daten anfragen?

Wir haben das Schreiben, mit dem Du eine Kopie Deiner Daten von der Honey Science LLC, dem Unternehmen hinter der Erweiterung, verlangen kannst, schon für Dich vorbereitet. Wie Du konkret vorgehen musst, hängt davon ab, ob Du Dich [bei Honey registriert](#honey-mit-account-genutzt) oder die Browsererweiterung [nur so](#honey-ohne-account-genutzt) benutzt hast. Für beide Fälle haben wir ein Formular, welches die Anfrage-E-Mail für Dich generiert.

Diese E-Mail kannst Du anschließend mit Deinem eigenem E-Mail-Programm oder Webmailer abschicken. So bleibt alles, was Du hier auf der Seite eingibst, **nur lokal auf Deinem Rechner**. Das heißt, dass wir diese Daten nie auch nur zu sehen bekommen.

Nachdem Du die E-Mail abgeschickt hast, hat Honey dann einen Monat Zeit, um Deine Anfrage zu beantworten. Sie dürfen unter Angabe von Gründen die Frist um bis zu zwei Monate verlängern, müssen Dir das aber innerhalb des ersten Monats mitteilen. Falls Du danach beschließt, dass Honey Deine Daten lieber nicht länger haben sollte, kannst Du zusätzlich mithilfe des {{< link slug="your-gdpr-rights#recht-auf-vergessenwerden" text="**Rechts auf Vergessenwerden**" >}} eine Löschanfrage stellen. Dafür kannst Du unseren {{< link slug="generator#!company=joinhoney" text="Generator" >}} <!-- TODO: set request type to DELETE when the generator supports this--> nutzen.

### Honey mit Account genutzt

Wenn Du Honey mit einem Account genutzt hast, musst Du nur noch Deinen Namen, Deine E-Mail-Adresse und Deinen „Honey Gold“-Kontostand eintragen und schon kannst Du Deinen Antrag einfach per E-Mail verschicken – natürlich kostenlos. 

Deinen Honey Gold Kontostand kannst Du [hier](https://www.joinhoney.com/honeygold/overview) abfragen.

<div id="act-with-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}

### Honey ohne Account genutzt

Du hast Honey genutzt, ohne ein Konto angelegt zu haben? Honey sammelt trotzdem Deine Verlaufsdaten. Um diese abzufragen, musst Du Dich aber identifizieren. Das klappt mit zwei Nummern (sog. *IDs*), die Honey Dir zugeteilt hat.

#### IDs rausfinden

Die beiden IDs (*userId* und *deviceId*) zu finden ist leider etwas umständlich, deshalb haben wir eine bebilderte Anleitung erstellt, die den Prozess genau erklärt.

Wir müssen uns den sogenannten „Local Storage“ der Honey-Browsererweiterung angucken. Das ist ein Platz in Deinem Browser, in dem Websites und Erweiterungen Daten speichern können. Du hast vielleicht schon einmal von Cookies gehört, Local Storage ist so ähnlich.

Wie genau das geht, unterscheidet sich von Browser zu Browser, wir zeigen es Dir für Firefox und Chrome:

<div class="box box-info">
<details open>
    <summary>🦊 Firefox</summary>
    <div class="slides">
        <div class="slider">
            <div class="slide" id="slide-ff-1">
                {{< img name="ff_typing_about_debugging" alt="In die Adresszeile von Firefox wurde „about:debugging“ eingetippt.">}}
                <p>Tippe <code>about:debugging</code> in die Adressleiste ein und drücke Enter. Du landest auf einer Einstellungsseite von Firefox.</p>           
                <div>
                    <a class="button button-secondary button-right" href="#slide-ff-2">Weiter <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ff-2">
                {{< img name="ff_about_debugging" alt="„Dieser Firefox“ auf „about:debugging“ ist rot umrahmt.">}}
                <p>Klicke auf „Dieser Firefox“.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ff-1"><span class="icon-arrow-left"></span> Zurück</a>
                    <a class="button button-secondary button-right" href="#slide-ff-3">Weiter <span class="icon-arrow-right"></span></a> 
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ff-3">
                {{< img name="ff_about_debugging_honey" alt="Eine Liste von den installierten Firefox-Erweiterungen auf „about:debugging“. „Untersuchen“ neben Honey ist rot umrahmt.">}}
                <p>Klicke neben der Honey-Erweiterung auf „Untersuchen“. Es öffnet sich eine neue Seite „Werkzeuge“.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ff-2"><span class="icon-arrow-left"></span> Zurück</a>
                    <a class="button button-secondary button-right" href="#slide-ff-4">Weiter <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ff-4">
                {{< img name="ff_localstorage" alt="Der Werkzeug-Tab von Honey ist geöffnet, „Web-Speicher“, „Local Storage“ und die deviceId und userId sind hervorgehoben.">}}
                <p>Wähle oben den Reiter „Web-Speicher“, anschließend links „Local Storage“ und das darunter erscheinende Element, das mit <code>moz-extension://</code> beginnt. Nun kannst Du in der Tabelle rechts die <code>deviceId</code> und <code>userId</code> kopieren oder ablesen.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ff-3"><span class="icon-arrow-left"></span> Zurück</a>
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
                {{< img name="ch_extensions.png" alt="In die Adresszeile von Chrome wurde „chrome://extensions“ eingetippt.">}}
                <p>Tippe <code>chrome://extensions</code> in die Adressleiste ein und drücke Enter. Du landest auf einer Einstellungsseite von Chrome.</p>
                <div>
                    <a class="button button-secondary button-right" href="#slide-ch-2">Weiter <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ch-2">
                {{< img name="ch_dev_on" alt="Der Schalter „Entwicklermodus“ oben rechts ist aktiviert und rot umrandet.">}}
                <p>Aktiviere den Entwicklermodus mit dem Schalter oben rechts.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ch-1"><span class="icon-arrow-left"></span> Zurück</a>            
                    <a class="button button-secondary button-right" href="#slide-ch-3">Weiter <span class="icon-arrow-right"></span></a> 
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ch-3">
                {{< img name="ch_honey" alt="Eine Liste von den installierten Chrome-Erweiterungen auf „chrome://extensions“. „Hintergrundseite“ bei Honey ist rot umrahmt.">}}
                <p>Klicke bei der Honey-Erweiterung auf „Hintergrundseite“. Es öffnet sich ein neues Fenster „DevTools“.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ch-2"><span class="icon-arrow-left"></span> Zurück</a>
                    <a class="button button-secondary button-right" href="#slide-ch-4">Weiter <span class="icon-arrow-right"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="slide" id="slide-ch-4">
                {{< img name="ch_local_storage" alt="DevTools von Honey ist geöffnet, „Application“, „Local Storage“ und die deviceId und userId sind hervorgehoben.">}}
                <p>Wähle in dem neuen Fenster „DevTools“ oben den Reiter „Application“. Vielleicht musst Du dafür das Fenster breiter ziehen. Klicke anschließend links auf „Local Storage“ und dort auf das angezeigte Element, das mit <code>chrome-extension://</code> beginnt. Nun kannst Du in der Tabelle rechts die <code>deviceId</code> und <code>userId</code> kopieren oder ablesen.</p>
                <div>
                    <a class="button button-secondary button-left" href="#slide-ch-3"><span class="icon-arrow-left"></span> Zurück</a>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</details>
</div>

Trag Deinen Namen, Deine E-Mail-Adresse und die beiden IDs nun nur noch in das Formular ein und schon kannst Du Deinen Datenauskunftsantrag absenden.

<div id="act-no-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}
<script>
window.addEventListener('load', function() {
    renderActWidget("act-with-account", {
        text_before_dynamic_input_container: "Du hast einen Account bei Honey angelegt? Dann nutze dieses Formular.",
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
                    "desc": "E-Mail-Adresse",
                    "type": "email",
                    "optional": false
                },
                {
                    "desc": "„Honey Gold“-Kontostand",
                    "type": "input",
                    "optional": false
                }
            ],
            "suggested-transport-medium": "email",
            "quality": "tested"
        }
    });
    renderActWidget("act-no-account", {
        text_before_dynamic_input_container: "Du hast Honey ohne Account benutzt? Dann nutze dieses Formular.",
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
                    "desc": "E-Mail-Adresse",
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

## Wie kann ich mich darüber beschweren? {#beschwerde}

Die DSGVO gibt Dir auch das Recht Dich bei den unabhängigen {{< link slug="supervisory-authorities" text="Datenschutz-Aufsichtsbehörden" >}} über Unternehmen zu beschweren, wenn Du der Meinung bist, dass diese Deine Datenschutzrechte verletzt haben. Das ist gratis für Dich und geht natürlich auch für Honey.

Eine Beschwerde kann formlos geschehen, du musst Dich dafür an keine bestimmten Vorgaben halten. Wenn Du Dich über Honey beschweren möchtest, solltest Du – sofern es zutrifft, in Deiner Beschwerde beschreiben, dass Du Deine Daten bei Honey angefragt hast und aufgrund der Antwort glaubst, dass Honey Deine Rechte verletzt hat. Am besten illustrierst Du das auch noch mit Beispielen aus dem Datensatz, den Honey Dir geschickt hat.  
Wir haben eine Vorlage vorbereitet, an der Du Dich orientieren kannst.

Achte darauf, die <span class="blog-letter-fill-in">geschweiften Klammern</span> auszufüllen (Vorsicht: Sie werden nicht mitkopiert) und alle erwähnten Dokumente anzuhängen. Die Abschnitte in [eckigen Klammern] sind optional; hier musst Du selbst entscheiden, ob Sie auf Deinen Fall zutreffen oder nicht. Du kannst (und solltest) natürlich auch alle anderen Aspekte der Vorlage an Deinen Fall anpassen, wenn nötig.

<div class="blog-letter" style="margin-bottom: 20px;">
<details>
<summary>Beschwerdevorlage (zum Ausklappen hier klicken)</summary>
<p>Guten Tag,</p>

<p>hiermit möchte ich Beschwerde nach Art. 77 DSGVO einreichen gegen folgenden Verantwortlichen:<br>
Honey Science LLC<br>
963 E. 4th Street<br>
Los Angeles, CA 90013<br>
USA</p>

<p>Ich bin Nutzer_in der Honey-Browser-Erweiterung (https://www.joinhoney.com), die von der Honey Science LLC (im Folgenden: „Honey“) betrieben wird (Angaben übernommen aus: https://www.joinhoney.com/privacy). [Dafür habe ich einen Account bei Honey angelegt.] [Ich habe Honey ohne Account verwendet.]</p>

<p>Am <span class="blog-letter-fill-in">hier das Datum Deiner Auskunftsanfrage eintragen</span> habe ich Honey per E-Mail an privacy@joinhoney.com (diese E-Mail-Adresse wird in der Datenschutzerklärung als Datenschutzkontakt genannt: https://www.joinhoney.com/privacy) um Auskunft über die zu mir gespeicherten Daten nach Art. 15 DSGVO gebeten.</p>

<p>Die Auskunft hat Honey mir am <span class="blog-letter-fill-in">hier das Datum von Honeys Antwort eintragen</span> erteilt. Sie enthält u.a. eine Datei „PageViews.csv“, die Seitenaufrufe auflistet. Sie hat insgesamt <span class="blog-letter-fill-in">hier die Anzahl der Zeilen eintragen</span> Zeilen. Da sie, wie ich im Folgenden darlegen werde, sensible Daten zu meiner Person enthält, habe ich diese Datei nicht angehängt, sondern werde nur Ausschnitte daraus zitieren. [Sollten Sie die Datei zur Bearbeitung meiner Beschwerde aber benötigen, bin ich bereit, sie zur Verfügung zu stellen.]</p>

<p>Dies sind einige beispielhafte Zeilen aus der „PageViews.csv“:</p>

<p><span class="blog-letter-fill-in">hier einige Beispielzeilen aus der Datei auflisten</span></p>

<p>Jeder Eintrag enthält mindestens die folgenden Informationen:</p>

<p>
* Zeitstempel, wann ich die entsprechende Seite aufgerufen habe<br>
* mehrere eindeutige IDs zu meiner Person, Sitzung und meinem Gerät<br>
* Informationen zu meinem Browser<br>
* Geolocation-Daten, die vermutlich aus meiner IP generiert wurden<br>
* die vollständige URL der Seite, die ich aufgerufen habe
</p>

<p>Die Datenschutzerklärung (https://www.joinhoney.com/privacy), enthält dazu Folgendes unter &quot;What data we collect and why&quot;:</p>

<p>
> „Honey does not track your search engine history, emails, or your browsing on any site that is not a retail website (a site where you can shop and make a purchase). When you are on a pre-approved retail site, to help you save money, Honey will collect information about that site that lets us know which coupons and promos to find for you. […]<br>
> Shopping and Usage Data.<br>
> On retail sites, Honey collects the name of the retailer, page views, and in some cases, product information that allows us to track price changes and update our product catalog. […]<br>
> […]<br>
> What data we do not collect<br>
> We collect information that we believe can help us save our users time and money. This does not include, and we do not collect, any information from your search engine history, emails, or from websites that are not retail sites.“
</p>

<p>Entgegen dieser Angaben sammelt Honey aber sehr wohl auch Daten auf anderen als Shopping-Seiten („retail sites“), nämlich u.a. auch [Login-Seiten, Blog-Artikel, Informationen zu Bestellungen, Hilfeseiten, Video-Streaming-Seiten und Foren]. In meiner Auskunft sind beispielsweise die folgenden URLs von Nicht-Shopping-Seiten protokolliert:</p>

<p><span class="blog-letter-fill-in">hier einige Beispiele von Nicht-Shopping-Seiten aus der Datei auflisten</span></p>

<p>Laut der Datenschutzerklärung (https://www.joinhoney.com/privacy) soll die Verarbeitung auf Art. 6 Abs. 1 lit. a oder lit. f DSGVO gestützt sein („When you consent to our use of your data for a specific purpose.“, „When Honey has a legitimate interest in using that data in the normal ways you&#39;d expect, like ensuring Honey&#39;s products run properly, improving and creating new products, historical analytics research, promoting Honey, and protecting our legal rights.“).</p>

<p>Sofern die Verarbeitung auf Art. 6 Abs. 1 lit. a DSGVO gestützt sein soll, bestreite ich das Vorhandensein einer „freiwillig für den bestimmten Fall, in informierter Weise und unmissverständlich abgegebene[n]“ Einwilligung (Art. 4 Nr. 11 DSGVO). [Ich habe Honey nie eine Einwilligung erteilt.] [Nach der Installation wurde mir folgender Text angezeigt: „We’re committed to your privacy. It’s always been our mission to find you the best deals. We only collect data when you’re on shopping sites. That way, we can find you relevant coupons, share accurate pricing trends, and continue to make shopping better for our community. You can read our founders’ commitment to privacy here (https://www.joinhoney.com/privacy). You can always come back and adjust your settings at any time“. Bei der Registrierung für einen Account musste ich das Häkchen bei „I have read and agree to the Honey Terms of Service (https://www.joinhoney.com/terms) and Privacy Policy (https://www.joinhoney.com/privacy). I understand that to continue, PayPal will share name and email address with Honey.“ auswählen. Damit fußte die Einwillung schon von Anfang an auf falschen Aussagen durch Honey (wie dargelegt erfolgt gerade doch eine Erhebung auf Nicht-Shopping-Seiten). Weiter war ohne Auswahl des Häkchens eine Registrierung nicht möglich. Es gab also keine Möglichkeit, die Einwilligung zu verweigern. Und schließlich konnte ich nur in die Datenschutzerklärung als Ganzes einwilligen, nicht aber in konkrete einzelne Zwecke. Daher ist trotz dieser erzwungenen Auswahl ist keine gültige Einwilligung zustandegekommen (vgl. OH Telemedien 2021 der Datenschutzkonferenz: https://www.datenschutzkonferenz-online.de/media/oh/20211220_oh_telemedien.pdf).]</p>

<p>Sofern die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO gestützt sein soll, bestreite ich das Vorhandensein eines berechtigten Interesses Honeys, das meinen Interessen oder Grundrechten und Grundfreiheiten überwiegen würde. Hier ist zu unterscheiden zwischen den Daten zu Shopping-Webseiten und Daten zu sonstigen Seiten. Für letztere ist beim besten Willen kein berechtigtes Interesse zu erkennen. Sie stehen in keinem Zusammenhang zur Honey-Erweiterung und es war für mich nicht erwartbar, dass diese Daten gesammelt würden. [Als ich die Auskunft erhalten habe, war ich entsetzt und schockiert darüber, wie umfangreich Honey mein Surfverhalten protokolliert hat.]
Für Daten zu Shopping-Webseiten mag Honey ein berechtigtes Interesse angeben. Aber selbst hier ist fragwürdig, ob die Verarbeitung verhältnismäßig ist, angesichts der umfangreichen Daten, die gesammelt werden, und dem Umstand, dass die Daten ohne zeitliche Begrenzung gespeichert werden („Honey only retains information about you as long as you keep using Honey“, aus: https://www.joinhoney.com/privacy)</p>

<p>Ich gehe also davon aus, dass Honey meine Daten ohne gültige Rechtsgrundlage verarbeitet hat. Daher wende ich mich nun mit meiner Beschwerde an Sie. Ich möchte Sie bitten das Verfahren zu prüfen und Honey ggf. die rechtswidrige Verarbeitung zu untersagen. Auch die Verhängung eines Bußgeldes bitte ich zu prüfen.
[Sie dürfen meine Daten zur Bearbeitung der Beschwerde an den Verantwortlichen weitergeben.] Die beschriebene Korrespondenz mit Honey habe ich an diese Beschwerde angehängt.</p>

<p>Sollten Sie weitere Informationen von mir benötigen, wenden Sie sich gerne an mich. Sie erreichen mich <span class="blog-letter-fill-in">hier Deine bevorzugte Kontaktmöglichkeit eintragen</span>.</p>

<p>Ich bedanke mich bereits im Voraus für Ihre Unterstützung.</p>

<p>Mit freundlichen Grüßen<br>
<span class="blog-letter-fill-in">hier Deinen Namen eintragen</span></p>
</details>
</div>

Welche Behörde für Dich zuständig ist, und wie Du sie erreichst, kannst Du mit diesem Tool herausfinden:

<div class="sva-finder"></div>
{{< noScript "noscript-sva" >}}

<script>
    window.props = { override: { country: { de: 'debralda' } } };
    window.addEventListener('load', function() { renderSvaFinder(); });
</script>

Die Behörde wird Deine Beschwerde prüfen und kann verschiedene Maßnahmen ergreifen. Diese reichen von einer Anweisung an Honey, das eventuelle Fehlverhalten einzustellen, bis hin zu empfindlichen Bußgeldern. Erfahrungsgemäß muss man bei Beschwerden aber Geduld mitbringen, insbesondere wenn Firmen in einem anderen Land ansässig sind.


---

**Änderungen**:

Die folgenden Änderungen haben wir seit der ursprünglichen Veröffentlichung an diesem Artikel vorgenommen:

- [20. Februar 2022](https://github.com/datenanfragen/website/pull/844): Artikel umstrukturiert und Hinweise auf die Beschwerdemöglichkeit und ein Beschwerdetemplate ergänzt.
