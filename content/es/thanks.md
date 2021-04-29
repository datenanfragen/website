{
    "title": "¡Gracias por su donación!",
    "type": "thanks",
    "aliases": ["gracias", "verein/thanks", "verein/gracias"]
}

<img class="top-right-humaaan" src="/img/humaaans/thanks.svg" alt="Un gran corazón flotando junto a una persona.">

¡Muchas gracias por tu donación! Realmente nos ayuda a seguir ejecutando nuestro sitio web de forma gratuita para todos en el futuro y también a iniciar un nuevo proyecto de protección de datos en Europa. Puede leer sobre lo que sucederá exactamente con su donación en nuestros {{< link slug="verein/transparency" text="informes anuales" >}}.

Si deseas apoyarnos con regularidad o simplemente deseas participar más, también puedes {{< link slug="verein/become-a-member" text="convertirse en miembro" >}}.

## ¿Dónde está mi recibo de donación?

Por supuesto, con gusto emitiremos un recibo por tu donación. **Sin embargo, ten en cuenta que solo estamos acreditados como una organización sin fines de lucro por las autoridades fiscales alemanas.** Consulta tu código fiscal local para ver cómo y si puede deducir su donación en tus declaraciones de impuestos.

Si donaste menos de 300 €, las oficinas de impuestos alemanas también aceptarán un [recibo de donación simplificado](https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf) en combinación con tu recibo de pago (extracto bancario, factura de tarjeta de crédito, etc…) para tu deducción fiscal.

Para donaciones más grandes, necesitarás un recibo de donación en formato oficial. Puedes obtener uno de estos de nosotros, pero necesitamos tu dirección para eso. Envíanos un correo electrónico a [vorstand@datenanfragen.de](mailto:vorstand@datenanfragen.de) (puedes cifrarlo con [esta llave PGP](/pgp/62A7EC35.asc)) con tu dirección y ID de donación o la referencia de tu transferencia bancaria.

<a id="request-donation-verification-button" class="button button-secondary icon icon-email" href="mailto:spenden@datenanfragen.de">Solicitar recibo de donación</a>
<a class="button button-secondary icon icon-download" href="https://static.dacdn.de/docs/vereinfachte-zuwendungsbestaetigung.pdf">Descargar recibo de donación simplificado</a>

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
