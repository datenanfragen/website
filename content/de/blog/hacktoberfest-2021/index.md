{
    "title": "Hacktoberfest 2021: Macht mit!",
    "type": "blog",
    "date": "2021-09-19T11:00:0+02:00",
    "description": "Wir halten 2021 auch wieder eine Hacktoberfest-Aktion ab. Mach' bei Datenanfragen.de mit und gewinne Sticker und vielleicht ein T-Shirt!",
    "tags": [ "hacktoberfest", "digitalocean", "github", "open source", "pull request"],
    "authors": [ "malte", "baltpeter" ],
    "notices": "TODO"
}


~~O'zapft is!~~ Der Oktober und damit auch das Hacktoberfest stehen wieder vor der Tür. Auch dieses Jahr wollen wir als Datenanfragen.de e.V. wieder am Hacktoberfest teilnehmen und freuen uns auf eure Einreichungen für unser Projekt! Wie auch schon in den letzten Jahres gibt es auch wieder etwas zu gewinnen.

### Image here

Wie auch das [ursprüngliche Hacktoberfest](https://hacktoberfest.digitalocean.com/) von Digital Ocean, wollen wir mit unserer Aktion Menschen die Mithilfe an Open Source Projekten näher bringen und freuen uns über jeden Beitrag für Datenanfragen.de und unsere Schwesterseiten. Konkret heißt das für Dich: Wenn du an unserer Aktion teilnimmst und etwas zu Datenanfragen.de beiträgst gewinnst du ein Sticker-Set (begrenzt auf die ersten 100 Teilnehmer_innen) und erhältst vielleicht auch ein T-Shirt von uns.

Unser Projekt und unser Ziel Datenschutz möglichst allen zugänglich zu machen, leben von reger Beteiligung aus der Community. Besonders freuen wir uns über Beiträge in Gebieten die wir ohne externe Hilfe nicht abdecken können: Übersetzungen von Deutsch und Englisch in andere in der EU gesprochene Sprachen, siehe z.B. [diesen Eintrag](https://github.com/datenanfragen/data/issues/229) in unserem Issue-Tracker. Oder wisst ihr von [Firmen die bestimmten EU-Ländern Daten von allen Bürger_innen sammlen?](https://github.com/datenanfragen/data/issues/230) Wenn ihr uns diese mitteilt, können wir unseren Nutzer_innen aus diesen Ländern direkt diese Firmen als Anfrageempfängerinnen vorschlagen.

Weiter unten gibt es ein Formular mit dem ihr euch bei unserer Aktion anmelden könnt. Bitte beachtet, dass unsere Aktion eigenständig von dem Hacktoberfest von Digital Ocean ist. Dieses Jahr vergeben wir wieder 10 T-Shirts unter den Einreichungen. Ihr könnt eure Beitrage entweder per PR in GitHub oder per git-patch per Email einreichen.

## Was gibt es für Belohnungen?

Die ersten 100 Teilnehmer_innen, die zwischen dem 01. Oktober 2020 und 01. November 2020 mindestens eine Pull-Request oder einen Patch in einem der [qualifizierten Repositories](#repos) eingereicht haben, die/der von uns angenommen wurde, bekommen von uns ein Sticker-Set geschenkt.

Darüber hinaus verlosen wir unter allen Teilnehmer_innen 10 T-Shirts für die besten Beiträge. Die Auswahl der Gewinner_innen erfolgt nach dem Ende der Aktion durch den Vorstand.

Die Teilnahme ist natürlich komplett kostenlos für Dich, wir bezahlen auch den Versand.

## Wie mache ich mit?

Unsere Aktion läuft unabhängig vom offiziellen Hacktoberfest. Wenn Du teilnehmen möchtest, musst Du Dich bis zum 04. November 2020 bei uns anmelden. Bei der Anmeldung musst Du noch keine Versandadresse angeben. Ganz im Sinne der Datensparsamkeit fragen wir diese erst nach dem Ende der Aktion bei Dir ab, wenn wir die Preise tatsächlich verschicken.

Wenn Du über GitHub mitmachen möchtest, verwende bitte dieses Formular, damit wir Deine Beiträge zuordnen können:

<div class="box form-group" style="max-width: 600px; margin: auto;">
<form action="https://backend.datenanfragen.de/hacktoberfest" method="POST">
Ich möchte an der Hacktoberfest 2021-Aktion des Datenanfragen.de e.&nbsp;V. über GitHub teilnehmen.
<div class="clearfix" style="margin-bottom: 5px;"></div>
<!-- Pattern adapted after: https://github.com/shinnn/github-username-regex/blob/0794566cc10e8c5a0e562823f8f8e99fa044e5f4/index.js#L1 -->
<label><div class="col40"><strong>GitHub-Nutzername</strong></div><div class="col60"><input type="text" pattern="^@?[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$" name="github_user" class="form-element" required></label></div>
<div class="clearfix" style="margin-bottom: 5px;"></div>
<label><div class="col40"><strong>E-Mail-Adresse</strong></div><div class="col60"><input type="email" name="email" class="form-element" required></label></div>
<div class="clearfix"></div>
<div class="form-group"><input type="checkbox" id="accept_terms" name="accept_terms" class="form-element" required><label for="accept_terms"><div style="float: left; width: 90%;">Die <a href="https://static.dacdn.de/docs/bedingungen-hacktoberfest-2021.pdf">Teilnahme- und Datenschutzbedingungen</a> habe ich zur Kenntnis genommen. Ich bin damit einverstanden.<sup class="color-teal-700">*</sup></div></label></div>
<div class="form-group"><input type="checkbox" id="accept_us_transfers" name="accept_us_transfers" class="form-element" required><label for="accept_us_transfers"><div style="float: left; width: 90%;">Ich möchte für meine Teilnahme die US-amerikanischen Plattform GitHub (<a href="https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-privacy-statement">Datenschutzerklärung</a>) nutzen, für die der Datenanfragen.de e.&nbsp;V. nicht das gleiche Datenschutzniveau wie in der EU garantieren kann. Es besteht das Risiko, dass meine Daten dem Zugriff durch US-Behörden unterliegen, wogegen mir möglicherweise keine wirksamen Rechtsbehelfe zur Verfügung stehen. Damit bin ich einverstanden.<sup class="color-teal-700">*</sup></div></label></div>
<input type="hidden" name="language" value="de">
<input type="hidden" name="year" value="2020">
<div style="float: right; margin-top: 10px;"><input class="button button-primary" type="submit" value="Registrieren"></label></div>
<div class="clearfix"></div>
</form>
</div>

Du hast aber auch die Möglichkeit, ohne Nutzung von GitHub teilzunehmen. Schick uns dazu bitte eine E-Mail an <hacktoberfest@datenanfragen.de>. In der E-Mail muss der Wunsch, an der Aktion teilzunehmen, das Einverständnis mit unseren [Teilnahme- und Datenschutzbedingungen](https://static.dacdn.de/docs/bedingungen-hacktoberfest-2021.pdf) und mindestens ein Git-Patch enthalten sein.

Übrigens: Wenn Du _zusätzlich_ beim offiziellen Hacktoberfest teilnehmen möchtest, musst Du Dich dafür [separat registrieren](https://hacktoberfest.digitalocean.com/). Das ist aber **nicht** nötig, um nur an unserer Aktion teilzunehmen.


## Welche Repositories zählen für die Aktion?

Für die Aktion werten wir nur Pull-Requests und Patches in den folgenden Repositories als gültige Beiträge:

* <https://github.com/datenanfragen/website>
* <https://github.com/datenanfragen/data>
* <https://github.com/datenanfragen/backend>
* <https://github.com/datenanfragen/company-json-generator>
* <https://github.com/datenanfragen/letter-generator>
* <https://github.com/datenanfragen/media>
* <https://github.com/datenanfragen/locate-contacts-addon>
* <https://github.com/zner0L/postcss-fonticons>

In Ausnahmefällen können wir auch weitere Repositories erlauben. Wenn Du meinst, dass Dein Beitrag in einem anderen Repository dem Projekt hilft, frag bitte vorher kurz per E-Mail an <hacktoberfest@datenanfragen.de> nach, ob wir diesen Beitrag auch werten können.

## Habt Ihr Vorschläge für Beiträge?  

<img class="offset-image offset-image-right" src="/card-icons/code.svg" height="150px" width="190px" style="height: 150px; margin-right: -100px; margin-top: -50px;" alt="">

Gerade wenn Du neu bei Datenanfragen.de bist, weißt Du wahrscheinlich gar nicht, wo Du anfangen kannst. Keine Sorge: Es gibt bei uns zahlreiche Bereiche, in denen Du mitmachen kannst – ganz unabhängig davon, ob Du Erfahrung mit Programmierung und Datenschutz hast oder nicht. Zum leichteren Einstieg haben wir Dir hier einmal ein paar Vorschläge zusammengestellt. Viele weitere Aufgaben findest Du in den Issues der jeweiligen Repositories. Wir freuen uns natürlich auch, wenn Du eigenen Ideen hast, was Du am Projekt verbessern könntest.

* **Neue Einträge für die Unternehmensdatenbank**  
  Ein Kern des Projekts ist unsere {{< link slug="/company" text="Unternehmensdatenbank" >}}. Darin sammeln wir die (Datenschutz-)Kontaktdaten von Unternehmen und anderen Organisationen. Mittlerweile haben wir schon etliche Einträge gesammelt, aber es fehlen natürlich noch viel mehr. Daher freuen wir uns immer über neue Unternehmenseinreichungen.  
  Ein kleiner Tipp: Unser [Unternehmens-JSON-Generator](https://company-json.netlify.com/) macht die Arbeit wesentlich leichter. Bitte lies Dir auch unsere [Hinweise zum Erstellen von Unternehmenseinträgen](https://github.com/datenanfragen/data#data-format-guidelines-and-resources-for-company-records) durch.

* **Zusammentragen von empfohlenen Unternehmen für weitere Länder**  
  Wie schon eingangs beschrieben, wollen wir Listen von Unternehmen pflegen, bei denen Nutzer_innen auf jeden Fall anfragen sollten, damit der Anfrageassistent auf unserer Startseite diese je nach eingestelltem Land anzeigen kann. Aktuell unterstützen wir da nur Deutschland, Österreich und Großbritannien. Am liebsten würden wir aber natürlich alle EU-Länder unterstützen. Wie Du helfen kannst, erfährst Du in [diesem GitHub-Issue](https://github.com/datenanfragen/data/issues/230).

* **Ergänzen von erforderlichen Elementen für Unternehmen**  
  Für DSGVO-Anfragen muss das Unternehmen Dich eindeutig identifizieren können. Die Daten, die dafür nötig sind, unterscheiden sich von Unternehmen zu Unternehmen. Deshalb sammeln wir diese Information auch in der Datenbank.

  Bei vielen Unternehmen fehlt diese Angabe aktuell noch, weshalb wir im Generator auf die Standardfelder (Name, E-Mail und Adresse) zurückfallen müssen, die aber nicht für alle Unternehmen passen. Hier können wir Deine Hilfe brauchen: In [diesem GitHub-Issue](https://github.com/datenanfragen/data/issues/720) haben wir genau erklärt, wie Du die entsprechenden Daten nachtragen kannst, indem Du selbst Anfragen an die entsprechenden Unternehmen stellst. Als netter Nebeneffekt erfährst Du dabei dann gleich auch etwas zu den Daten, die diese Unternehmen über Dich verarbeiten.

* **Schreiben und Übersetzen von Beiträgen**  
  In unserem {{< link slug="blog" text="Blog" >}} haben wir Artikel zu vielen Datenschutzthemen. Die Bandbreite reicht von Erklärungen zu den DSGVO-Rechten und deren Ausübung über Kommentare zu aktuellen Geschehnissen in Sachen Datenschutz bis hin zu Anleitungen, wie man die Downloadtools, die einige Webseiten mittlerweile anbieten, nutzt. Dieses Angebot würden wir gerne weiter ausbauen. Reiche neue Artikel bitte im [website-Repository](https://github.com/datenanfragen/website) ein.

  Eine weitere wichtige Aufgabe ist das Übersetzen dieser Beiträge in die anderen Sprachen, die wir unterstützen. Auch dafür ist das [website-Repository](https://github.com/datenanfragen/website) die richtige Anlaufstelle.

* **Übersetzen der Anfragevorlagen in weitere Sprachen**  
  Unsere Anfragevorlagen gibt es schon in etlichen Sprachen, wir würden aber gerne alle EU-Sprachen unterstützen. Mehr dazu erfährst Du in [diesem GitHub-Issue](https://github.com/datenanfragen/data/issues/229).

* **Mitarbeit am Code**  
  Der Kern des Projektes ist natürlich unsere [Webseite](https://github.com/datenanfragen/website). Du hast eine Funktion, die Du gerne implementieren würdest oder einen Bug, den Du beheben möchtest? Wir freuen uns auf Deinen Beitrag!  
  Falls Du noch keine Idee hast, haben wir auf [GitHub einige Issues zusammengestellt](https://github.com/datenanfragen/website/issues).

## Noch Fragen?

Wenn Du noch Fragen hast, schreib uns gerne eine Mail an <hacktoberfest@datenanfragen.de> oder hinterlasse uns hier einen Kommentar. Wir helfen Dir auch gerne, falls Du Probleme hast oder Dich in unseren Repositories nicht zurecht findest – hier ist dann ein Kommentar in dem entsprechenden Issue am besten geeignet.

Happy Hacking!

<script>
window.onload = function() {
  if (PARAMETERS.error) {
    if (PARAMETERS.error === 'validation') alert('Die Anmeldedaten, die Du angegeben hast, waren leider nicht korrekt. Bitte versuche es erneut.');
    else if (PARAMETERS.error === 'server') alert('Bei der Registrierung ist leider ein Fehler auf unserer Seite aufgetreten. Bitte versuche es später erneut oder wende Dich über hacktoberfest@datenanfragen.de an uns.');
    else if (PARAMETERS.error === 'duplicate') alert('Diese GitHub-Nutzer_in oder diese E-Mail-Adresse ist bereits registriert. Das warst nicht Du? Bitte wende Dich über hacktoberfest@datenanfragen.de an uns.');
    else if (PARAMETERS.error === 'expired') alert('Die Anmeldefrist ist leider schon abgelaufen.');
  }
  else if (PARAMETERS.success === '1') alert('Deine Registrierung wurde erfolgreich bearbeitet. Du solltest gleich eine Bestätigung per E-Mail erhalten.');
}
</script>
