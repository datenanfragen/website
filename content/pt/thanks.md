{
    "title": "Thank you for your donation!",
    "type": "thanks",
    "aliases": ["verein/thanks"]
}

<img class="top-right-humaaan" src="/img/humaaans/thanks.svg">

Muito obrigado pela sua doação! Isso realmente nos ajuda a continuar operando nosso site gratuitamente para todos no futuro e também a iniciar um novo projeto de proteção de dados na Europa. Você pode ler sobre o que exatamente acontecerá com sua doação em nossos [relatórios anuais] ({{<ref "verein / transparência">}}).

Se você gostaria de nos apoiar regularmente ou apenas deseja se envolver mais, você também pode [se tornar um membro] ({{<ref "verein / se tornar um membro">}}).

## Onde está meu recibo de doação?

Certamente emitiremos um recibo de sua doação. ** No entanto, observe que só somos credenciados como uma organização de caridade pelas autoridades fiscais alemãs. ** Verifique seu código tributário local para ver como e se você pode deduzir sua doação para nós em suas declarações fiscais.

Se você doou menos de 200 €, os escritórios fiscais alemães também aceitarão um [recibo de doação simplificado] (https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf) em combinação com seu recibo de pagamento (extrato bancário, fatura de cartão de crédito,…) para sua dedução fiscal.

Para doações maiores, você precisará de um recibo de doação no formulário oficial. Você pode conseguir um desses conosco, é claro, mas precisamos do seu endereço para isso. Envie-nos um e-mail para [vorstand@datenanfragen.de] (mailto: vorstand@datenanfragen.de) (você pode criptografá-lo com [esta chave] (/ pgp / 62A7EC35.asc)) com seu endereço e ID de doação ou a referência de sua transferência bancária.

<a id="request-donation-verification-button" class="button button-secondary icon icon-email" href="mailto:spenden@datenanfragen.de">Solicitar recibo de doação</a>
<a class="button button-secondary icon icon-download" href="https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf">Baixe recibo de doação simplificado</a>

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
