{
    "title": "Danke für Deine Spende!",
    "type": "thanks",
    "aliases": ["verein/thanks", "danke", "verein/danke"]
}

<img class="top-right-humaaan" src="/img/humaaans/thanks.svg" alt="Ein großes Herz schwebt neben einer Person.">

Vielen herzlichen Dank für Deine Spende! Damit hilfst Du uns ungemein, unsere Webseite in Zukunft weiter für alle kostenlos anbieten zu können und vor allem neue Projekte für den Datenschutz in Europa zu starten. Was genau mit Deiner Spende passiert, kannst du in unseren {{< link slug="verein/transparency" text="Jahresberichten" >}} nachlesen. 

Wenn Du uns gerne regelmäßig unterstützen möchtest oder einfach mehr involviert sein möchtest, kannst Du auch bei uns {{< link slug="verein/become-a-member" text="Mitglied werden" >}}.

## Wie bekomme ich eine Bescheinigung für meine Spende?

Selbstverständlich stellen wir Dir gerne einen Nachweis für Deine Spende aus.

Wenn Du weniger als 300 € gespendet hast, reicht dem Finanzamt dafür auch ein [vereinfachter Zuwendungsnachweis](https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf) in Verbindung mit Deinem Zahlungsbeleg (Kontoauszug, Kreditkartenabrechnung, …) in der Steuererklärung.

Für größere Spenden benötigst Du einen tatsächlichen Zuwendungsnachweis nach dem amtlichen Vordruck. Den kannst Du natürlich auch von uns bekommen, dazu benötigen wir allerdings Deine Adresse. Schick uns dafür bitte eine E-Mail an [vorstand@datenanfragen.de](mailto:vorstand@datenanfragen.de) (verschlüsseln kannst Du die E-Mail mit dem [Vorstands-Key](/pgp/62A7EC35.asc)) mit deiner Adresse und Deiner Spendennummer bzw. dem Verwendungszweck Deiner Überweisung.

<a id="request-donation-verification-button" class="button button-secondary icon icon-email" href="mailto:spenden@datenanfragen.de">Zuwendungsnachweis anfragen</a>
<a class="button button-secondary icon icon-download" href="https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf">Vereinfachten Zuwendungsnachweis herunterladen</a>

{{< script >}}
window.onload = function () {
    var donation_reference = window.PARAMETERS.donation_reference;
    if(donation_reference) {
        document.getElementById('request-donation-verification-button').setAttribute('href', encodeURI('mailto:vorstand@datenanfragen.de?' +
            'Subject=Antrag Zuwendungsnachweis (Spende #' + donation_reference + ')' +
            '&Body=Guten Tag,\n\nich möchte einen Zuwendungsnachweis für meine Spende #' + donation_reference + ' beantragen.\n' +
            'Bitte sendet ihn mir an meine Adresse:\n\n\nMit freundlichen Grüßen\n'
        ));
    }
};
{{< /script >}}
