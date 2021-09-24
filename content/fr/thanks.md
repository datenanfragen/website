{
    "title": "Merci pour ton don !",
    "type": "thanks",
    "aliases": ["verein/thanks"]
}

<img class="top-right-humaaan" src="/img/humaaans/thanks.svg" alt="">

Merci beaucoup pour ton don ! Cela nous aide vraiment à continuer à faire fonctionner notre site Web gratuitement pour tous à l'avenir et à lancer de nouveaux projets pour la protection des données en Europe. Tu peux savoir exactement où ton argent est allé dans nos {{< link slug="verein/transparency" text="rapports annuels" >}}.

Si tu souhaites nous soutenir de manière récurrente ou bien seulement être un peu plus impliqué, tu peux également {{< link slug="verein/become-a-member" text="devenir membre" >}}.

## Où est mon reçu de don ?

Nous serons bien entendu heureux de te délivrer un reçu pour ton don. **Toutefois, note que nous ne sommes accrédités en tant qu'association caritative que par les autorités fiscales allemandes.** Vérifie ton règlement fiscal local pour savoir comment et si tu peux déduire ton don dans tes déclarations de revenus.

Si tu as fait un don inférieur à 300 €, les services fiscaux allemands accepteront également un [reçu de don simplifié] (https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf) en combinaison avec ton reçu de paiement (relevé bancaire, relevé de carte de crédit, …) pour ta déduction fiscale.

Pour des dons plus importants, tu auras besoin d'un reçu de don en bonne et due forme. Tu peux bien sûr en obtenir un auprès de nous, mais nous avons besoin de ton adresse pour cela. Envoie-nous un e-mail à [vorstand@datenanfragen.de](mailto:vorstand@datenanfragen.de) (tu peux le chiffrer avec [cette clé](/pgp/62A7EC35.asc)) avec ton adresse et le numéro d'identification du don ou la référence de ton virement bancaire. 

<a id="request-donation-verification-button" class="button button-secondary icon icon-email" href="mailto:spenden@datenanfragen.de">Demander un reçu de don</a>
<a class="button button-secondary icon icon-download" href="https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf">Télécharger le reçu de don simplifié</a>

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
