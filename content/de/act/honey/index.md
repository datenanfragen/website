{
    "title": "Honey in Sammelwut – jetzt eine Kopie Deiner Daten anfragen",
    "type": "act",
    "date": "2020-11-02T14:43:34+02:00",
    "tags": [ "addon", "datenauskunft", "verlaufsdaten", "datensammlung", "browser-verlauf" ],
    "featured_image": "honey.jpg",
    "authors": [ "malte", "baltpeter" ],
    "notices": "Titelfoto angepasst nach: „[Busy bees](https://unsplash.com/photos/StEaRc1xQV4)“ von [Boba Jaglicic](https://unsplash.com/@bobajaglicic) ([Unsplash-Lizenz](https://unsplash.com/license))"
}

In unserer {{< link slug="blog/honey-data-collection" text="Recherche zu Honey" >}} haben wir aufgedeckt, dass die Browser-Erweiterung reichlich Daten zu Ihren Nutzer_innen sammelt. Unabhängig davon, ob ein Account angelegt wurde oder nicht, protokolliert das Add-on fleißig alle Aufrufe zahlreicher Webseiten und sendet sie an den Betreiber, die {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, ein US-Unternehmen, das kürzlich vom Bezahlanbieter [PayPal gekauft wurde](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

{{< featuredImg alt="Foto etlicher Bienen, die sich auf Zuckerwasser stürzen, darüber der Text: „Honey in Sammelwut – jetzt Daten anfragen“" >}}

## Wie kann ich meine Daten anfragen?

Hast Du Honey genutzt und warst Dir dieser Datensammelei vielleicht nicht bewusst? Oder willst Du einfach wissen, was Honey über Dich gespeichert hat? Die DSGVO gibt Dir eine ganze Reihe an {{< link slug="your-gdpr-rights" text="Rechten im Bezug auf Deine personenbezogenen Daten" >}}, darunter auch das Recht, eine kostenfreie Kopie aller Daten die ein Unternehmen über Dich gesammelt zu erhalten – das sogenannte {{< link slug="your-gdpr-rights#auskunftsrecht" text="**Auskunftsrecht**" >}}.

Dabei können wir Dir helfen. Wir sind ein gemeinnütziger Verein, der sich {{< link slug="verein/mission-statement" text="für Dein Recht auf Datenschutz einsetzt" >}}. Wir haben das entsprechende Schreiben an die Honey Science LLC, das US-amerikanische Unternehmen hinter der Erweiterung, mit dem Du die eine Kopie Deiner Daten verlangen kannst, schon einmal vorbereitet. Je nachdem ob Du Dich bei Honey registriert hast oder die Browsererweiterung [nur so](#honey-ohne-account-genutzt) benutzt hast, haben wir zwei Formulare vorbereitet.

Die E-Mail kannst Du anschließend mit Deinem eigenem E-Mail-Programm oder Webmailer abschicken. So kann alles, was Du hier auf der Seite eingibst, **nur lokal auf Deinem Rechner** verarbeitet werden. Das heißt, dass wir diese Daten nie auch nur zu sehen bekommen.

Nachdem Du die E-Mail abgeschickt hast, hat die Honey Science LLC dann einen Monat Zeit, um Deine Anfrage zu beantworten. Sie dürfen unter Angaben von Gründen die Frist um bis zu zwei Monate verlängern, müssen Dir das aber innerhalb des ersten Monats mitteilen. Falls Du danach beschließt, dass Honey deine Daten lieber nicht länger haben sollte, dann kannst du auch per {{< link slug="your-gdpr-rights#recht-auf-vergessenwerden" text="**Recht auf Vergessenwerden**" >}} eine Löschanfrage stellen. Dafür kannst Du unseren {{< link slug="generator#!company=joinhoney" text="Generator" >}} <!-- TODO: set request type to DELETE when the generator supports this--> nutzen.

### Honey mit Account genutzt

Du musst nur noch Deinen Namen, Deine E-Mail-Adresse und Deinen „Honey Gold“-Kontostand eintragen und schon kannst Du Deinen Antrag einfach per E-Mail verschicken – natürlich kostenlos. 

Deinen Honey Gold Kontostand kannst Du [hier](https://www.joinhoney.com/honeygold/overview) abfragen.

<div id="act-with-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}

### Honey ohne Account genutzt

Du hast Honey genutzt, ohne ein Konto angelegt zu haben? Honey sammelt trotzdem Deine Verlaufsdaten. Um diese abzufragen, musst Du Dich aber identifizieren, das klappt mit zwei IDs, die Honey angelegt hat.

Trag einfach Deinen Namen, Deine E-Mail-Adresse und die beiden IDs unten in das Formular ein und schon kannst Du Deinen Datenauskunftsantrag absenden.

#### IDs rausfinden

Die beiden IDs (*userId* und *deviceId*) zu finden ist leider etwas umständlich, aber doch recht einfach, wenn Du diese Anleitung befolgst:

Wir müssen uns den sogenannten „Local Storage“ der Honey-Browsererweiterung angucken. Der Local Storage ist ein Platz in Deinem Browser, den Websites und Erweiterungen nutzen können, um Daten zu speichern.
Du hast vielleicht schon einmal von Cookies gehört, Local Storage ist so ähnlich.
Wie das geht, unterscheidet sich von Browser zu Browser, wir haben zwei bebilderte Anleitungen für Firefox und Chrome bereitgestellt:
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

<div id="act-no-account" class="act-widget" style="max-width: 600px; margin: auto;"></div>
{{< noScript "noscript-actwidget" >}}
<script>
window.onload = function() {
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
                    "desc": "Email",
                    "type": "email",
                    "optional": false
                },
                {
                    "desc": "Honey Gold Kontostand",
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
};
</script>
