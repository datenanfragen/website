{
    "title": "Mas que solo codigos de cupones: La extension de navegadores Honey tambien colecciona el historial de datos de sus usuarios",
    "type": "blog",
    "date": "2021-09-02T12:04:03+02:00",
    "description": "Nuestra investigacion demuestra que: La extension gratuita Honey no solo colecta codigos de cupones. Usando el derecho de acceso de datos del GDPR, Hemos confirmado que ellos tambien colecionan datos en grande escala de todos su usuarios. Devido a esto sometimos algunas quejas",
    "featured_image": "honey-te-mira-mienstras-navegas",
    "tags": [ "addon", "coupon codes", "data collection", "history data", "right to data access" ],
    "authors": [ "c0d3x27" ],
    "notices": "Photo adapted after: \"[Alien Invasion](https://unsplash.com/photos/QMFZhJCufKw)\" by [Henry Mwenge](https://unsplash.com/@ayende_the_walkingman) ([Unsplash license](https://unsplash.com/license))"
}

**La extensión de navegador gratuita "Honey" quiere ahorrarle dinero a todo sus usuarios buscando y aplicando automáticamente códigos de cupónes. Se auto proclaman defensores de la protección de datos y dicen solo guardar datos históricos de sitios webs donde se hacen compras. Dos de nuestros miembros que han usado Honey en el pasado, solicitaron acceso sus datos usando el GDPR. Analisando sus respuestas pudimos demostrar que Honey guarda historial de datos a grande escala, contrariamente a lo que dice su misma política de privacidad. Devido a esto, hemos enviado algunas quejas a las autoridades de protección de datos.**

{{< featuredImg alt="Photo of multiple beekeepers who watch their bees, above that the text: “La extension de codigos para cupones Honey tambien guarda datos historiales de los navegagores”" >}}

"Para de gastar dinero: Honey te ayudara a encontrar algunos de los mejores codigos para cupones en mas de 30.000 sitios web". Así es como Honey se describe en su pagina de bienvenida. Esta extensión para navegadores gratuita tiene mucha publicidad en YouTube y otros sitios web. La idea detrás de esto no es nada nuevo. Han siempre existido sitios web que guardan codigos de cupones para varias tiendas online por mucho tiempo. 

Honey trata de ir más alla y quiere facilitar este proceso a todos sus usuarios. Existen veces, que los códigos de algunos cupones utilizados en estos sitios web estan vencidos o solo funcionan para un cierto tipo de artículo. Tratar de probar diferentes codigos de cupones, que mayormente se encuentran distribuidos en diferentes sitios web, puede resultar algo bastante frustrante. Honey promete hacer este trabajo por ti. Una vez que es instalado en tu navegador, la extencion metera automáticamente todos los numeros de cupones que conoce en las páginas del carrito de compras de todo los sitios web compatibles. Para finalizar usando el que mas permita ahorrar. 

Honey gana dinero a través del llamado "afiliacion de marketing". Las tiendas participantes le pagan una comision a Honey por todos los cupones que vegan utilizados por sus usuarios. 

Hasta aquí todo va bien. Pero como somos una organización de fines sin lucro que promueve la protección de datos, lo que más nos interesa saber es: ¿Como hace Honey para procesar los datos de sus usuarios? Al ser una extencion para navegadores, Honey podría, en teoría, registrar todo nuestro trafico mientras navegamos en internet y por lo tanto, registrar todo el historial del navegador. Esto es algo especialmente problemático ya que Honey esta administrada por una empresa estadounidense, {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, que recientemente fue comprada por [PayPal](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

## De preciso cuales son los datos que vienen guardados?

Para saber cuales son los datos que guarda Honey, Podemos empezar por leer su política de privacidad (y, por supuesto, [lo hicimos] (# honey-privacy-policy)). Pero, lamentablemente, muchas veces son muy generales. En verdad nunca dicen al usuario que tipo de datos se coleciona sobre ellos. Por fortuna, el GDPR puede ayudar en esto. Da a los usurios {{<link slug = "blog / your-gdpr-rights" text = "derechos amplios con respecto a tus datos">}}. Uno de estos viene llamado * derecho al acceso de datos *, definido por el art. 15 del RGPD, y permite a todos los consumidores exigir una copia de los datos que muchas empresas guardan de tu persona. Con esto puedes verificar si las declaraciones de una empresa son reales o no. 

Dos de nuestros miembros, Benni y Malte, hicieron uso de este tipo de derecho. Ambos por un tiempo usaron la extensión Honey en sus navegadores. Benni registro una cuenta y la utilizo para iniciar una sesion de ingreso en la extensión, mientras que Malte usó la extensión sin una cuenta registrada. Ambos usaron nuestro {{<link slug = "generator" text = "generador">}} para enviar una solicitud de acceso a Honey 

Despues analizamos las respuestas que ellos recibieron por parte de honey

### Datos colecionados usando una sesion de un account registrado

Cuando se inicio una sesion con una cuenta registrada, acceder a los datos fue muy fácil. La respuesta con los datos llego en dos semanas y algo mas. Tenía varios archivos CSV que contenian diferentes temas. Los primeros documentos contenían detalles esperados: los datos del perfil del usuario, país e idioma, el restante de * Honey Gold *, una lista de transacciones que califica para Honey Gold, direcciones IP y los navegadores utilizados al momento de registrar la cuenta e instalar la extension.

Sin embargo, tambien contenía un documento llamado `PageViews.csv` que nos sorprendio mas. Asi como el nombre lo indica, este documento contiene una lista de paginas visitadas o visitadas por Benni, que utilizo la extension desde mediados de febrero del 2020 hasta mediados de mayo del 2020, contenía la asombrosa cantidad de 2591 visitas. 

Para darles un exemplo, una de las lineas del documento se miraba asi (Disponible en columnas para que puedan leerlo mejor):

<style>
#honey-table td:nth-child(1), th:nth-child(1) { text-align: right !important; }
#honey-table td:nth-child(2), th:nth-child(2) { text-align: left !important; }
</style>
<table id="honey-table" class="table fancy-table">
    <thead>
        <tr>
            <th>Field</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>ts</td>
            <td>2020-03-05T20:00:21.281Z</td>
        </tr>
        <tr>
            <td>store</td>
            <td>{country=DE, id=48298155042910438, label=logitech-de, name=Logitech Germany, session_id=1583438408900}
            </td>
        </tr>
        <tr>
            <td>src</td>
            <td>extension</td>
        </tr>
        <tr>
            <td>user_id</td>
            <td>8291877052743772122</td>
        </tr>
        <tr>
            <td>device_id</td>
            <td>8281837226426454371</td>
        </tr>
        <tr>
            <td>visitor_id</td>
            <td>8281837231485163268</td>
        </tr>
        <tr>
            <td>session_id</td>
            <td>1583434254900</td>
        </tr>
        <tr>
            <td>platform</td>
            <td>ff</td>
        </tr>
        <tr>
            <td>version</td>
            <td>11.11.4</td>
        </tr>
        <tr>
            <td>referrer_url</td>
            <td><a
                    href="https://www.logitech.com/de-de/product/k860-split-ergonomic-keyboard?crid=27">https://www.logitech.com/de-de/product/k860-split-ergonomic-keyboard?crid=27</a>
            </td>
        </tr>
        <tr>
            <td>language</td>
            <td>en-US</td>
        </tr>
        <tr>
            <td>location</td>
            <td>{city=Hamburg, country=DE, region=HH}</td>
        </tr>
        <tr>
            <td>os</td>
            <td>{name=Windows, version=10}</td>
        </tr>
        <tr>
            <td>browser</td>
            <td>{major=68, name=Firefox, version=68.0}</td>
        </tr>
        <tr>
            <td>client_ts</td>
            <td>2020-03-05T20:00:20.6Z</td>
        </tr>
    </tbody>
</table>

Como se puede ver: **Por cada pagina online visitada, Honey registraba como minimo las siguientes informaciónes**: Hora de la visita, multiples ** ID unicos ** por usuario, la sesión y el tipo dispositivo, sistema operativo, tipo y versión del navegador, detalles de geolocalizacion y la **URL completa de la página visitada**.
Usando estos detalles, esta empresa obtiene una visión amplia y detallada del comportamiento de compra de sus usuarios. Conociendo no solo los productos que compran sus usuarios, pero también todos los productos que miraron, aunque no fueran comprados, como tambien el tiempo que miraron la pagina de estos productos. 

{{< img name="honey-pageviews" alt="Captura de pantalla de la ventana de LibreOffice. La respuesta del documento de las paginas vista de Honey fue abierto. Debido a la grande cantidad de visitas, solo una pequeña parte del archivo es visible, y ni siquiera sepueden ver todas las columnas. "Caption =" El documento `PageViews` nos da una buena idea de la magnitud de la recopilación de datos que tiene Honey. Solo de Benni, documentaron un total de 2591 visitas a paginas web, incluyendo una gran cantidad de metadatos ">}} 

Sin embagor, nosotros consideramos que este tipo de procedimiento sea excesivo. Es posible que podamos justificar un poco Honey, ya que el objetivo de esta extencion es encontrar codigos de cupones para luego ser utilizados en la compra de productos que los usuarios miran. El problema es que Honey guarda * muchos * mas datos del necesario. 

Es mas, no solo registran las paginas de los productos de las tiendas en sitios web. sino que, Honey guarda todo tipo visitas a todo tipo de página el cual el dominio la empresa haya clasificado como un "sitio web de compras online". Sin embargo muchos sitios web de compras no solo incluyen las páginas actuales de estos productos. Muchas veces tienen diferentes tipos de contenidos, como por ejemplo publicaciones de blogs o páginas con ingresos para iniciar sesiones.
Pero Honey va todavia más lejos: Registran visitas a topo tipo de páginas incluso a paginas que se encuentran en diferentes subdominios. Esto quiere decir, que también se documentan los hábitos de navegación del usuario en innumerables foros, páginas de soportes y todo tipo de sitios web. El URL completo de todas estas paginas viene guardado, incluyendo el fragmento de documento que pueda permitir reconstruir la posición precisa de la página que visito cada usuario. Estos registros de URL y sus parámetros también pueden contener datos personales sensibles, permitiendo a Honey obtener una vista detallada de los hábitos de navegación de sus usuarios. 

Para demostrar el poder de los perfiles que Honey podría crear usando estos datos, hemos seleccionado y transferido algunas filas de datos de Benni y ahora describiremos qué tipo de información podríamos extraer de esto. A continuacion aqui debajo pueden ver exactamente los datos correspondiente a cada renglon

Honey sabe que el 13 de febrero del 2020 a las 2:57 p.m, Benni miro una [guía de iFixit] (https://www.ifixit.com/Guide/Nintendo+Wii+DVD+Drive+Lens+Replacement/4491) explicando cómo cambiar el lente DVD en una Wii. Vio los detalles de su pedido en AliExpress `3002876007952992` por un total de 13 veces, iniciando el 17 de febrero a las 7:43 p.m. El inicio una disputa por el estado de este pedido el 25 de febrero a las 10:01 a. M. Pero antes de eso, fue a buscar un Airbnb en Berlín-Mitte el 24 de febrero a las 8:02 p.m. En el período entre el 4 de marzo y el 5 de marzo estuvo buscando un alojamiento completo o una habitación en un hotel para dos adultos. El 1 de marzo a las 6:46 p.m. visto la [página de soporte de la Apple](https://support.apple.com/en-us/HT204306) que describe cómo reiniciar un iPhone se olvida el código de como desbloquearlo. El día despues a las 2:25 p.m estuvo interesado en [CC-by license](https://creativecommons.org/licenses/by/4.0/) de Creative Commons y el 10 de marzo a las 9:04 p.m. visito [Fabric UI Framework](https://developer.microsoft.com/en-us/fabric) de Microsoft. Aparentemente, también es miembro de una grupo de Microsoft, ya que agregó otro miembro a su familia el dia despues a las 7:45 p.m. para compartir los beneficios de su suscripción de Office 365 junto a ellos. El 14 de marzo a las 11:49 a.m. Estuvo leyendo un [artículo](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/cve-2018-1000136-electron-nodeintegration-bypass/) sobre una vulnerabilidad de seguridad en el Electron. El 23 de marzo a las 5 de las tarde, estuvo mirando el documental ["Scanning The Pyramids"](https://curiositystream.com/video/1984/scanning-the-pyramids) usando el proveedor de streaming CuriosityStream. Servicio del cual se volvio un miembro solo media hora antes, a las 4:29 p.m. luego de ser reclutado por el YouTuber Tom Scott registrandose usando su enlace de afiliado. El 25 de marzo a las 6:51 p.m, volvió a interesarse en un viaje, esta vez de FlixBus. El 1 de mayo planeó un viaje solo entrada, para un adulto entre Berlín y Leipzig. Pero este viaje nunca se llevó a cabo, ya que no existen más entradas en FlixBus. El 22 de abril a las 8:33 a.m Benni cambio un juego en Steam con el código `5HGP6-JVK5C-I92YW`. El 11 de mayo a las 9:04 p.m. se entero de la falta de soporte para exportar en formato MKV en Adobe Premiere en el[Foro de soporte de Adobe](https://community.adobe.com/t5/premiere-pro/premiere-pro-cc-doesn-t-support-mkv-longer-td-p/10586989?page=1). Tiene una Amazon AWS con acceso al bucket S3 llamado `dacdn-static`. Este bucket contiene un documento con el siguiente contenido `speak/subtitles/20200511-okl-berlin-en.vtt`, que miró el 13 de mayo a las 3:09 PM.

**Honey puede extraer toda esta informacion derectamente de los datos que ellos guardan de sus usuarios.** Y los ejemplos que mostramos solo representan una pequeña parte de la información que puede tiener Honey. Las 27 líneas en las que se basan los ejemplos, solo representan un poco más del 1 &nbsp;% de las entradas que Honey guardo de Benni. Nos hemos centrado en las visitas de páginas no relacionadas con productos. Queremos hacer presente que Honey también conoce todos los productos que Benni miró mientras instalaba la extensión. Además, podrían usar los datos que tienen para obtener aún más conclusiones y perfiles. Por ejemplo, podrían extraer cuales son los periodos de sueño a partir de los horarios o crear perfiles de interese basados en los sitios web ya visitados.

<details>
<summary>Los datos sin modificar de lo eventos descritos anteriormente que guarda honey</summary>
<pre style="white-space: pre;">
ts,timestamp,store,extension,product,src,sub_src,user_id,device_id,visitor_id,session_id,platform,version,referrer_url,first_referrer_url,language,campaign,location,os,browser,group,is_logged_in,client_ts
2020-02-13T14:57:51.523Z,,"{country=US, id=7583916003951006414, label=i-fix-it, name=iFixit, session_id=1581602269900}","","",extension,,8291877052743772122,8291877052743758554,8291895932342390791,1581595975000,ff,11.11.4,https://www.ifixit.com/Guide/Nintendo+Wii+DVD+Drive+Lens+Replacement/4491,,en-US,"","{city=Bad Oldesloe, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-02-13T13:57:51.4Z
2020-02-17T19:43:17.236Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1581968534100}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1581936825700,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Bad Oldesloe, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-02-17T19:43:16.3Z
2020-02-24T20:02:12.145Z,,"{country=US, id=7587516493463718696, label=airbnb, name=Airbnb, session_id=1582574363800}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1582534687100,ff,11.11.4,https://www.airbnb.com/s/Berlin~Mitte--Berlin--Germany/homes?refinement_paths%5B%5D=%2Fhomes&current_tab_id=home_tab&selected_tab_id=home_tab&place_id=ChIJjw3Y6t9RqEcR8jUVWEcgISY&source=mc_search_bar&search_type=filter_change&screen_size=large&hide_dates_and_guests_filters=false&checkin=2020-03-04&checkout=2020-03-05&adults=2&room_types%5B%5D=Entire%20home%2Fapt&room_types%5B%5D=Hotel%20room&display_currency=EUR,,en-US,"","{city=Rostock, country=DE, region=MV}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-02-24T20:02:11.7Z
2020-02-25T10:01:59.798Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1582624864000}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1582623816500,ff,11.11.4,https://trade.aliexpress.com/issue/fastissue/createIssueStep1.htm?orderId=3002903971712992,,en-US,"","{city=Schwerin, country=DE, region=MV}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-02-25T10:01:59.2Z
2020-03-01T18:46:04.123Z,,"{country=US, id=17, label=apple, name=Apple, session_id=1583084768100}","","",extension,,8291877052743772122,8291877052743758554,8291895932342390791,1583084759200,ff,11.11.4,https://support.apple.com/en-us/HT204306?&cid=acs::fm-itunes_HT204306,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-01T17:46:10.9Z
2020-03-02T14:25:25.816Z,,"{country=US, id=7361522878151783724, label=creativecommons-org, name=Creative Commons, session_id=1583159123500}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583154968200,ff,11.11.4,https://creativecommons.org/licenses/by/4.0/,,en-US,"","{city=Stockelsdorf, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-02T14:25:25.4Z
2020-03-07T13:19:24.76Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1583587060300}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583574168600,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-07T13:19:24.4Z
2020-03-07T13:21:40.151Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1583587060300}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583574168600,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-07T13:21:39.6Z
2020-03-07T18:14:58.884Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1583604884200}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583604866700,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-07T18:14:58Z
2020-03-08T11:36:52.513Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1583667398700}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583667362900,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Kremperheide, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-08T11:36:51.1Z
2020-03-09T11:44:05.486Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1583752311900}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583749216100,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-09T11:44:05.1Z
2020-03-10T21:04:10.801Z,,"{country=US, id=122, label=microsoft-store, name=Microsoft, session_id=1583874244400}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583832289500,ff,11.11.4,https://developer.microsoft.com/en-us/fabric#/,,en-US,"","{city=Kremperheide, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-10T21:04:07.7Z
2020-03-11T19:45:49.092Z,,"{country=US, id=122, label=microsoft-store, name=Microsoft, session_id=1583955903100}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1583922904000,ff,11.11.4,https://account.microsoft.com/family/addmember?fref=home.card.family,,en-US,"","{city=Elmshorn, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-11T19:45:41.9Z
2020-03-14T11:49:09.056Z,,"{country=US, id=7361469548202545964, label=trustwave, name=Trustwave, session_id=1584186541800}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1584179216400,ff,11.11.4,https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/cve-2018-1000136-electron-nodeintegration-bypass/,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-14T11:49:08.7Z
2020-03-17T10:06:47.525Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1584439382000}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1584439381300,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992&tsp=1583832300166,,en-US,"","{city=Celle, country=DE, region=NI}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-17T10:06:47.4Z
2020-03-23T16:29:34.015Z,,"{country=US, id=42259640467140034, label=curiosity-stream, name=Curiosity Stream, session_id=1584980481900}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1584958430200,ff,11.11.4,https://curiositystream.com/signup?coupon=tomscott,,en-US,"","{city=Rostock, country=DE, region=MV}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-23T16:29:33.4Z
2020-03-23T17:00:42.516Z,,"{country=US, id=42259640467140034, label=curiosity-stream, name=Curiosity Stream, session_id=1584980481900}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1584958430200,ff,11.11.4,https://curiositystream.com/video/1984/scanning-the-pyramids?playlist=19,,en-US,"","{city=Rostock, country=DE, region=MV}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-23T17:00:42.1Z
2020-03-25T18:51:40.79Z,,"{country=DE, id=247322013778274911, label=flixbus-germany, name=FlixBus Germany, session_id=1585162297800}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585133661200,ff,11.11.4,https://shop.flixbus.de/search?departureCity=88&arrivalCity=113&_locale=de&rideDate=01.05.2020,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-25T18:51:40.2Z
2020-03-30T08:25:25.066Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1585556420300}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585556420300,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Rostock, country=DE, region=MV}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-30T08:25:24.4Z
2020-03-30T08:28:09.825Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1585556420300}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585556420300,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Rostock, country=DE, region=MV}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-03-30T08:28:09.6Z
2020-04-01T10:25:34.637Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1585736721600}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585736673800,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-04-01T10:25:33.2Z
2020-04-01T14:55:02.121Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1585736721600}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585736673800,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-04-01T14:55:01.5Z
2020-04-02T11:00:35.021Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1585820373300}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585820373200,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Elmshorn, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-04-02T11:00:34.6Z
2020-04-04T20:12:33.632Z,,"{country=US, id=7370049848889092396, label=aliexpress, name=AliExpress, session_id=1586030876600}","","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1585989775700,ff,11.11.4,https://trade.aliexpress.com/order_detail.htm?orderId=3002876007952992,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-04-04T20:12:33.2Z
2020-04-22T08:33:30.901Z,,"{country=US, id=133238312198527675, label=steam-powered, name=Steam Store, session_id=1587544407800}","{}","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1587534152000,ff,12.1.1,https://store.steampowered.com/account/registerkey?key=5HGP6-JVK5C-I92YW,,en-US,"","{city=Hamburg, country=DE, region=HH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-04-22T08:33:30.2Z
2020-05-11T21:04:20.58Z,,"{country=US, id=7360588083760779820, label=adobe, name=Adobe, session_id=1589231040300}","{}","",extension,,8291877052743772122,8281914735067352913,8281914738548402176,1589231026600,ff,12.1.1,https://community.adobe.com/t5/premiere-pro/premiere-pro-cc-doesn-t-support-mkv-anymore/td-p/10586989?page=1,,en-US,"","{city=Heiligenstedten, country=DE, region=SH}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-05-11T21:04:20.1Z
2020-05-13T15:09:27.998Z,,"{country=US, id=1, label=amazon, name=Amazon, session_id=1589377697100}","{}","",extension,,8291877052743772122,8281837226426454371,8281837231485163268,1589348807400,ff,12.1.1,https://s3.console.aws.amazon.com/s3/object/dacdn-static/talks/subtitles/20200511-okl-berlin-en.vtt?region=eu-central-1&tab=overview,,en-US,"","{city=Hanover, country=DE, region=NI}","{name=Windows, version=10}","{major=68, name=Firefox, version=68.0}",,,2020-05-13T15:09:27.8Z
</pre>
</details>

Un aspecto preocupante es que: **Honey dice que conserva estos datos hasta que el usuario no decida de eliminar su cuenta por definitivo.**[^duración] incluso aun no está muy claro si realmente eliminan el historial de datos o simplemente eliminan la relación tu la cuenta.

[^duration]: En particular, a la solicitud de acceso de datos Honey respondio: "Honey solo conserva tu información mientras estes utilizes los Servicios de Honey. Si eliminas tu cuenta o nos pides que la eliminemos, ya no tendremos ninguna información personal que se pueda atribuir a ti."

### Coleccion de datos sin una cuenta

Honey también coleciona los mismos datos de personas que simplemente usan la extensión sin registrar una cuenta. Aunque si para Malta acceder a sus datos fue mucho más difícil. La primera respuesta a su solicitud, que explícitamente decia que no había creado una cuenta, sino que simplemente usó la extensión, le respondieron que no encontraron una cuenta vinculada a el y que por esto, no pudieron cumplir con su solicitud.

Incluso después de otro intervento de parte de Malte, preguntando por mas informacion en como obtener los datos de identificación necesarios para los usuarios no registrados Honey insistió en que no tenían ningún dato personal suyo. Cuando les dijo que el derecho de acceso según el RGPD también incluye datos seudonimizados, afirmaron que la extensión solo generaba una identificación local. Sin una registracion, supuestamente no tenían acceso a esta identificación y no tenian como conectar los datos a Malte: 

> "Si descarga la extensión Honey, se genera y se guarda localmente un número identificativo. No tenemos acceso a este número de identificación y no podemos conectar esta información o identificar esta información [sic] hasta que una cuenta venga creada. "  
> –<cite>El e-mail de Honey para Malte</cite> (traducido de la lengua original alemana)

Probablemente La mayoría de los usuarios se habrían rendido después de recibir una respuesta como esta, Honey habría obtenido éxito en evitar que hicieran uso de su derecho de acceso a sus datos. Pero como las declaraciones de Honey no nos parecían honestas, analizamos la extensión. Pudimos confirmar que las extensiones envían un valor llamado `exv` por cada evento que informa a Honey. El parecido de este valor es <code style="overflow-wrap: anywhere;">ff.12.6.3.8411225708576469508.8411225706699646724</code> y contiene el navegador (`ch` de Chrome,` ff` de Firefox), la versión de la extensión (por ejemplo `12.6.3`) y las identificaciones únicas de la persona y el dispositivo, asi como este extracto de la fuente del código de la extensión de Honey de Google Chrome (versión 12.6.3, formateada por Chrome DevTools) muestra: 

```js
function v(e) {
    return n.default.props({
        userId: s.default.getUserId(),
        deviceId: g(e)
    }).then(function(e) {
        return "ch.12.6.3." + e.userId + "." + e.deviceId
    })
}
```

Esto quiere decir que, Honey es absolutamente capaz de conectar cualquier evento enviado de sus extensiones a una identificación única, incluso aun sin crear una cuenta. Y ya que el derecho de acceso también cubre datos seudonimizados [^pseudo], Honey tiene que cumplir con las solicitudes de acceso, por ejemplo en este caso. Solo después que Malte descubrió por sí mismo cómo ver las identificaciones necesarias, Honey le dio acceso a sus datos.

[^pseudo]: ver mas ejemplos: Oficina del Comisionado de la Información , ["¿Los datos seudonimizados siguen siendo datos personales?"](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/what-is-personal-data/what-is-personal-data/#pd4) in ["Que son datos personales?"](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/what-is-personal-data/what-is-personal-data/): "La seudonimización es en realidad solo una medida de seguridad. No cambia el estado de los datos como datos personales. El art 26 deja claro que los datos personales seudonimizados siguen siendo datos personales y están dentro del alcance del RGPD."

{{< img name="honey-event-report" alt="Captura de pantalla del navegador de Firefox. El tráfico de red de la extensión Honey se analiza utilizando DevTools. Se selecciona el enlace que termina en`evs` y se muestran todos los detalles relativos. Los datos enviados por la extensión incluyen los parámetros `referrer_url` con el valor de `https://www.ebay.com/sch/i.html?_nkw=fairphone` y `exv` con un valor de `ff.12.4. 5.8409582601733493035.8409582599411239211`(ambos resaltados en rojo). `Exv` es un ID único para el usuario y `referrer_url` le permite a Honey saber si el usuario simplemente busco la palabra `fairphone` en eBay. `Caption=` Incluso aun sin una cuenta, la extensión informa de las visitas a la páginas anteriores (incluyendo una identificación única) a Honey, como esta búsqueda de un nuevo teléfono inteligente en eBay.">}} 

Nuestro análisis a datos proporcionados de Malte por Honey solo confirmó lo que ya teniamos pensado: **La extensión informa los mismos eventos y datos del historial a Honey, independientemente si la usa con o sin una cuenta registrada.**

## ¿Cómo describe Honey la recopilación de datos? {#honey-privacy-policy}

Entonces, ahora echemos un vistazo a cómo Honey describe su recopilación de datos. Su [política de privacidad](https://www.joinhoney.com/privacy) comienza con una carta de sus fundadores en la que afirman su compromiso con la protección de datos. Afirman que solo recopilan los datos necesarios para ejecutar su producto y que siempre dejan a los usuarios la opción de decidir si están de acuerdo con el procedimiento:

> "Como usuarios del Internet, nos preocupamos por la privacidad al igual que usted. […]
> 
> En primer lugar, analizamos ciertas informaciónes en el sitio web minorista en el que se encuentra para poder encontrar los mejores cupones para ese sitio o producto. Además, guardamos datos de compras limitados para apoyar a la comunidad de Honey. […]
> 
> Nuestra postura sobre la privacidad es simple: seremos transparentes con los datos que recopilamos y cómo los usamos para ahorrarles tiempo y dinero. Usted puede decidir si esta de acuerdo con esto o no."  
> –<cite>Honey, <a href="https://www.joinhoney.com/privacy">“Una carta de nuestros fundadores”</a></cite>

Esta promesa se explica con más detalle en su [política de recopilación de datos](https://www.joinhoney.com/data-and-privacy/). Allí, afirman que para que la extensión funcione era necesario informar de ciertos eventos que el usuario genera mientras navega por en web. Sin embargo, estos eventos no contienen ningun dato personal:

> La extensión informa sobre ciertos eventos para informarnos cuando un usuario interactúa con ella o realiza una acción en un sitio que apoyamos. Estos eventos habilitan las funciones básicas de la extensión y brindan información sobre cómo mejorar la experiencia del usuario. **Ninguna información que recopilamos de estos eventos contiene información de identificación personal** (PII) como nombres o direcciones de correo electrónico. Tampoco recopilamos información confidencial como números de tarjetas de crédito, números de teléfono o contraseñas.  
> – <cite>Honey, <a href="https://www.joinhoney.com/data-and-privacy/">Explicaciónes de las políticas de recopilación de datos de Honey</a> (Destacar por nosotros)

La política de privacidad explica cuales son los datos que realmente se recopilan un poco mas detalladamente:

> "Cuando se encuentre en un **sitio al detalle preaprobado**, para ayudarte a ahorrar dinero, Honey recompilará información sobre ese sitio que nos permite saber qué cupones y promociones encontrar para usted. […]
> 
> *Datos de compras y uso.*
> 
> **En los sitios al detalle, Honey guarda el nombre del detallista, las visitas a las páginas y en algunos casos, la información del producto** que nos permite realizar un seguimiento de los cambios de precios y actualizar nuestro catálogo de productos. […]"  
> –<cite>Honey, <a href="https://www.joinhoney.com/privacy">“Política de privacidad y seguridad de Honey”</a></cite> (Destacar por nosotros

Finalmente aqui descubrimos que se realiza un seguimiento de las visitas a las páginas en los sitios web de compras. Pero siguen afirmando que esto solo sucede en los sitios de compras.

**Nuestro análisis ha demostrado que las declaraciones de Honey no son ciertas.** La recopilación real de datos por ellos supera con creces tanto lo que sería necesario como lo que describen en su sitio web. Al contrario de lo que dicen, Honey rastrea el historial de navegación de sus usuarios y guarda los datos personales de sus usuarios a gran escala y esto no se limita a los sitios al detalle.

## Nuestras quejas

Estamos convencidos de que esta recopilación de datos por parte de Honey va demasiado lejos. De acuerdo con el GDPR, todo procesamiento de datos personales debe basarse en una de las seis bases legales posibles (ver Art. 6 (1) GDPR). El interesado debe ser informado de la base legal que se utiliza en el momento del procesamiento (ver Art. 13 (1) (c) y (d) GDPR). Como Honey no ha hecho esto, Benni se los preguntó explícitamente. Esto es lo que ellos respondieron:

> "La extensión Honey guarda datos de tablones de anuncios [sic] para determinar qué cupones o anuncios deben ofrecerse. En pocas palabras, necesitamos saber en qué sitio web detallista te encuentras para ofrecerte una oferta aplicable a ti. Así es como funciona Honey. Creemos que esto representa un interés legítimo para esta forma particular de procesamiento. Tenga en cuenta también que ha dado su consentimiento para el procesamiento cuando descarga e instala Honey en su navegador."  
> –<cite>La email enviada de Honey a Benni</cite> (traducto del aleman su lengua origial)

De esto, pudimos concluir que Honey quiere basar este procesamiento en el Art. 6 (1) (a) o (f) del RGPD. Reclaman un interés legítimo en el tratamiento de estos datos que supera los intereses y derechos fundamentales de los interesados. Además, la afirmación de que los usuarios han dado su consentimiento para el procesamiento al instalar la extension. Creemos que nada de esto proporciona una base legal suficiente para el procesamiento que realiza Honey. 

Suponiendo que incluso se haya dado un consentimiento correcto [^noconsent] solo se aplica a los propósitos dados en la política de la privacidad. Y como ya hemos visto, el alcance real de el almanezamiento de datos definitivamente no se explica adecuadamente allí.
Del mismo modo, tan poco se puede otorgar un interés legítimo a la medida en que el procesamiento de los datos sea realmente necesario para ejecutar la extensión. Es comprensible que Honey necesite conocer el sitio web en el que se encuentra un usuario para encontrar el código del cupón correspondiente. Pero como hemos demostrado, recaudan muchos más datos que no tienen nada que ver con este propósito. 

[^noconsent]: Hemos demostrado mediante experimentos que es posible instalar la extensión Honey sin dar el consentimiento para ningún procesamiento de dato. Para ello, hemos creado un nuevo perfil en otro navegador e instalamos la extensión. Mientras se abre una ventana que le pide al usuario que cree una cuenta y dé su consentimiento para ello, la ventana simplemente se puede cerrar sin completar nada. La extensión aún funciona y de manera crucial, aún envía los datos descritos a Honey. Hemos documentado este comportamiento en [este video](https://static.dacdn.de/other/honey-keine-einwilligung.mp4).

{{< img name="honey-registration-after-install" alt="Captura de pantalla de una página del sitio web de Honey en Firefox. La página tiene un URL el cual es `https://www.joinhoney.com/welcome?onInstall=true` y se abrió automáticamente después de instalar la extensión. La página tiene el titulo "¡Honey está instalada!" y un subtítulo que dice "Ahora, comencemos creando una cuenta". Debajo hay dos casillas de verificación con los textos "Al unirme, acepto las Condiciones de servicio y la privacidad de Honey. Protecto por reCAPTCHA y los términos y la privacidad de Google". y “Reciba noticias y ofertas de Honey por correo electrónico. Puedes cambiar tu preferencias de comunicación en tu cuenta de Honey en cualquier momento ". Ambos se comprueban previamente incluso sin la interacción del usuario. Debajo de las casillas de verificación hay una serie de botones con los textos "Conectate con Google", "Conectate con Facebook" y "Conectate con PayPal". Hay incluso más botones, pero están cortados en la captura de pantalla."Caption=" Después de instalar la extension, Honey sugiere crear una cuenta para que el usuario pueda dar su consentimiento. La casilla de verificación correspondiente ya está marcada de forma predeterminada.">}}

En nuestra opinión, si hubiera una base legal válida, la duración del almacenamiento es demasiado larga. No vemos una razón para guardar datos tan sensibles de forma indefinida. En cambio, sería apropiado guardar los datos de navegación solo temporalmente y luego almacenar solo estadísticas agregadas y anónimas, si es necesario.

Finalmente, Honey primero le negó a Malte su derecho al acceso a los datos e incorrectamente afirmó que no tenía ningún dato sobre él.

**Por esto, presentamos dos quejas ante las autoridades supervisoras de protección de datos** [^quejas] y explicamos por qué creemos que el procesamiento de Honey es ilegal. Nuestro objetivo es obligar a Honey a poner fin a estas prácticas y ser más respetuosas con la privacidad de todos sus usuarios. Ahora es trabajo de las autoridades verificar las quejas de Benni y Malte. Ellos, tienen la autoridad para prohibir que Honey procese los datos de esta manera o incluso de imponerles una multa (ver Art. 58 (2) GDPR).
Nuestras quejas aún no se han procesado.

[^quejas]: Estamos publicando el texto original (alemán) de ambas quejas: [Primera queja](https://static.dacdn.de/docs/honey/beschwerde-1.pdf), [segunda queja](https://static.dacdn.de/docs/honey/beschwerde-2.pdf)

## ¿Qué datos ha guardado Honey sobre ti?

El derecho al acceso a los datos del que hemos hablado en esta publicación también se aplica a usted. Si también ha utilizado Honey y desea saber qué datos han recopilado sobre usted, puede enviar una solicitud usted mismo. Definitivamente recomendamos hacer eso: hay una gran diferencia entre escuchar qué datos alguien guarda de ti y ver realmente los datos que tienen.

En datarequests.org nuestra misión es ayudarte a ejercer su derecho a la privacidad. por supuesto, también queremos ayudarte con tu solicitud de Honey. Es por eso que hemos puesto una {{<link slug="act/honey" text="página separada">}} que explica en detalle qué detalles de identificación necesitas para tu solicitud y cómo obtenerlos. Luego, todo lo que necesita hacer es enviar la solicitud por correo electrónico; ya hemos escrito la carta que necesitas.

<a href="{{< ref "act/honey" >}}" class="button button-primary icon icon-email" style="float: right;">Solicita tus datos a Honey</a><div class="clearfix"></div>

y si decides que no está de acuerdo con la vasta recopilación de datos de Honey, puedes hacer uso de su {{<link slug="your-gdpr-rights # right-to-be-recommended" text="*derecho al olvido*">}} y exigir la eliminación de tus datos. Puedes usar nuestro {{<link slug="generator#!Company=joinhoney" text="generator">}} para eso.
Por último, también tiene derecho a presentar una queja usted mismo. Te explicamos cómo funciona esto en nuestro{{< link slug="supervisory-authorities" text="puestealo a las autoridades supervisoras" >}}.
