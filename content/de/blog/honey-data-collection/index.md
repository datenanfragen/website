{
    "title": "Nicht nur Gutscheine: Browser-Erweiterung Honey sammelt auch Verlaufsdaten von Nutzer_innen",
    "slug": "datensammlung-bei-honey",
    "aliases": [ "honey-data-collection" ],
    "type": "blog",
    "date": "2020-11-02T14:34:13+02:00",
    "description": "Unsere Recherche zeigt: Die kostenlose Browser-Erweiterung Honey sammelt nicht nur Gutscheine. Mithilfe des Rechts auf Selbstauskunft nach der DSGVO haben wir herausgefunden, dass auch Browser-Verlaufsdaten im großem Umfang dauerhaft gespeichert werden. Deshalb haben wir Beschwerden eingelegt.",
    "featured_image": "honey-beobachtet-dich-beim-surfen",
    "tags": [ "addon", "coupon-codes", "datensammlung", "browser-verlauf", "auskunftsrecht" ],
    "authors": [ "baltpeter" ],
    "notices": "Titelfoto angepasst nach: „[Alien Invasion](https://unsplash.com/photos/QMFZhJCufKw)“ von [Henry Mwenge](https://unsplash.com/@ayende_the_walkingman) ([Unsplash-Lizenz](https://unsplash.com/license))"
}

**Die kostenlose Browser-Erweiterung „Honey“ möchte ihren Nutzer_innen durch das automatische Suchen von Gutschein-Codes Geld sparen. Honey beschreibt sich selbst als datenschutzfreundlich und sammelt angeblich nur Daten zum Surfverhalten auf Online-Shopping-Webseiten. Zwei unserer Mitglieder, die Honey genutzt hatten, haben mithilfe der DSGVO Auskunft über die Daten angefragt, die zu ihnen gesammelt wurden. Unsere Auswertung der Antworten zeigt, dass Honey entgegen der eigenen Angaben in großem Stil Browser-Verlaufsdaten sammelt. Deshalb haben wir Beschwerde bei den Datenschutzaufsichtsbehörden eingelegt.**

{{< featuredImg alt="Foto von mehreren Imker_innen, die Bienen beobachten, darüber der Text: „Gutschein-Erweiterung Honey sammelt auch Browser-Verlaufsdaten“" >}}

„Hör auf Geld rauszuwerfen – Honey hilft dir, einige der besten Coupon-Codes auf über 30.000 Websites zu finden.“ Mit diesen Worten bewirbt Honey das eigene Produkt auf seiner Startseite. Die kostenlose Browser-Erweiterung wird auf YouTube und anderen Plattformen kräftig beworben. Die Idee ist keine neue. Webseiten, die Gutschein-Codes für allerlei Online-Shops sammeln und veröffentlichen, gibt es schon lange.

Honey geht aber einen Schritt weiter und möchte seinen Nutzer_innen diesen Prozess erleichtern. Teils sind die Gutscheine, die sich auf solchen Seiten finden, nämlich nicht mehr gültig oder funktionieren nur für bestimmte Produkte. Von Hand die vielen Codes, die noch dazu über etliche Gutscheinseiten verteilt sind, auszuprobieren, kann tatsächlich nervig sein. Honey verspricht, diese Arbeit zu übernehmen. Hat man das Add-on einmal im Browser installiert, probiert es auf den Warenkorbseiten unterstützter Shops automatisch alle bekannten Coupons aus und wendet am Ende den an, der die größte Ersparnis bringt.

Sein Geld verdient Honey dabei über sogenanntes „Affiliate-Marketing“. Hierbei bezahlen die teilnehmenden Händler für die eingesetzten Gutscheine und anderweitig vermittelten Verkäufe eine Provision an Honey.

So weit, so gut. Als Datenschutzverein interessiert uns aber vor allem eins: Wie geht Honey mit den Daten seiner Nutzer_innen um? Als Browser-Erweiterung könnte Honey nämlich theoretisch den Internet-Traffic mitschneiden und so den gesamten Browser-Verlauf protokollieren. Das ist besonders brisant, weil Honey von einem US-Unternehmen, der {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, betrieben wird und gerade erst vom Bezahlanbieter [PayPal gekauft wurde](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

## Welche Daten werden tatsächlich gesammelt?

Um herauszufinden, welche Daten Honey sammelt, könnte man zunächst einen Blick in die Datenschutzerklärung werfen (was wir natürlich auch [gemacht haben](#honeys-angaben)). Doch solche Informationen sind häufig leider sehr allgemein. Sie geben Nutzer_innen keine wirkliche Vorstellung, welche Daten denn nun tatsächlich zu ihnen gesammelt werden. Zum Glück kann hier die DSGVO helfen. Sie gewährt allen Verbraucher_innen {{< link slug="blog/your-gdpr-rights" text="umfassende Rechte im Bezug auf ihre Daten" >}}. Dazu gehört auch das sogenannte *Auskunftsrecht*, das in Art. 15 DSGVO definiert wird, und jeder Verbraucher_in erlaubt, bei Unternehmen eine Kopie der zu ihr gespeicherten Daten zu verlangen. Dadurch werden die Angaben von Unternehmen nachprüfbar.

Von diesem Recht haben zwei unserer Mitglieder, Benni und Malte, Gebrauch gemacht. Beide hatten die Honey-Erweiterung in der Vergangenheit für eine Weile genutzt. Dabei hatte Benni einen Honey-Account angelegt und sich damit in der Erweiterung angemeldet, während Malte die Erweiterung ohne Account genutzt hat. Beide haben also über unseren {{< link slug="generator" text="Generator" >}} eine Anfrage an Honey gestellt.

Die Antworten, die sie erhalten haben, haben wir anschließend ausgewertet.

### Datensammlung bei Nutzung mit Account

Mit Account stellte sich das Anfragen als sehr leicht heraus. Nach etwas mehr als zwei Wochen war die Auskunft da. Enthalten war eine Reihe von CSV-Dateien zu verschiedenen Themen. In diesen finden sich zunächst die Daten, die man erwarten würde: die Daten aus dem Profil, Land und Sprache, das *Honey Gold*-Guthaben, eine Liste der Transaktionen, die für Honey Gold infrage kommen, die IP-Adressen und Browser zum Zeitpunkt der Registrierung und Installation der Erweiterung.

Wesentlich überraschender ist hingegen die Datei `PageViews.csv`. Wie der Name schon vermuten lässt, befindet sich darin eine Auflistung von Seitenaufrufen. Bei Benni, der die das Add-on von Mitte Februar 2020 bis Mitte Mai 2020 in seinem Browser installiert hatte, sind das sage und schreibe 2591 Einträge.

Eine der Zeilen sieht dabei beispielsweise so aus (hier der besseren Lesbarkeit halber als Spalte dargestellt):

<style>
#honey-table td:nth-child(1), th:nth-child(1) { text-align: right !important; }
#honey-table td:nth-child(2), th:nth-child(2) { text-align: left !important; }
</style>
<table id="honey-table" class="table fancy-table">
    <thead>
        <tr>
            <th>Feld</th>
            <th>Wert</th>
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

**Honey protokolliert also bei jedem Aufruf einer Seite in einem Online-Shop mindestens die folgenden Informationen**: einen Zeitstempel, mehrere **eindeutige IDs** für Person, Sitzung und Gerät, das Betriebssystem, den Browser und die Browserversion, Angaben zum Standort („Geolocation“), und die **vollständige URL der aufgerufenen Seite**.  
Dadurch erhält das Unternehmen ein äußerst umfangreiches Bild über das Shopping-Verhalten seiner Nutzer_innen. Es kennt nicht nur die Produkte, die bestellt werden, sondern auch all die Produkte, die sich zwar angeschaut, aber im Endeffekt nicht bestellt werden, inkl. der Information, wie lange die jeweilige Produktseite angeschaut wurde.

{{< img name="honey-pageviews" alt="Screenshot des Programms LibreOffice. Es ist die PageViews-Datei aus der Honey-Datenauskunft geöffnet. Aufgrund der Vielzahl an Einträgen sind nur ein Bruchteil der Zeilen und nicht einmal alle Spalten der Tabelle dargestellt." caption="Die `PageViews`-Datei zeigt das Ausmaß von Honeys Datensammlung. Für Benni wurden ganze 2591 Seitenaufrufe inkl. zahlreicher Metadaten protokolliert." >}}

Wir halten schon diese Verarbeitung für überzogen. Sie ließe sich allerdings vielleicht gerade noch rechtfertigen, wenn man bedenkt, dass Honey Gutscheine für die Produkte finden soll, die angeschaut werden. Doch Honeys Sammelwut geht noch wesentlich weiter.

Es werden nämlich nicht nur Produktseiten aus Online-Shops protokolliert. Vielmehr speichert Honey sämtliche Aufrufe von Seiten, deren Domain das Unternehmen selbst als „Online-Shopping-Webseite“ klassifiziert hat. Aber viele Shopping-Seiten haben neben den eigentlichen Produktseiten noch zahlreiche andere Inhalte auf ihren Seiten, darunter etwa Blog-Artikel und Login-Seiten.  
Und es geht *noch* weiter: Honey protokolliert sogar die Aufrufe aller Unterseiten, selbst wenn diese auf anderen Subdomains liegen. Dadurch wird das Surfverhalten in zahlreichen Foren, Hilfeseiten und vielem weiterem dokumentiert. Und bei alldem wird jeweils die vollständige URL protokolliert, sogar inklusive des Dokumentenfragments, das ggf. Rückschlüsse auf die genaue Position innerhalb der Seite erlaubt. Die protokollierten URLs und die enthaltenen URL-Parameter können auch sensible Daten enthalten, in jedem Fall erlauben sie Honey aber ein umfangreiches Rekonstruieren des Surfverhaltens der jeweiligen Nutzer_in.

Um zu demonstrieren, wie umfangreich die Profile sind, die Honey aus diesen Daten erstellen könnte, haben wir einmal beispielhaft einige Zeilen aus der Auskunft von Benni herausgesucht und beschreiben hier, welche Informationen sich daraus schließen ließen. Die exakten Rohdaten der entsprechenden Zeilen veröffentlichen wir weiter unten.

Honey weiß, dass Benni sich am 13. Februar 2020 um 14:57 Uhr bei iFixit eine [Anleitung](https://www.ifixit.com/Guide/Nintendo+Wii+DVD+Drive+Lens+Replacement/4491) angeschaut hat, die das Austauschen der DVD-Linse bei einer Wii beschreibt. Die Details zu seiner AliExpress-Bestellung mit der Nummer `3002876007952992` hat er sich insgesamt 13 mal angeschaut, zuerst am 17. Februar um 19:43 Uhr. Zu dieser Bestellung hat er dann am 25. Februar um 10:01 Uhr einen Käuferschutzantrag gestellt. Vorher hat er aber noch am 24. Februar um 20:02 Uhr nach einem Airbnb in Berlin-Mitte gesucht, und zwar eine gesamte Unterkunft oder ein Hotelzimmer für zwei Erwachsene und für den Zeitraum vom 04. bis 05. März. Am 01. März um 18:46 hat er sich einen [Support-Artikel](https://support.apple.com/en-us/HT204306) von Apple angeschaut, der beschreibt, wie man ein iPhone bei vergessenem Entsperrcode zurücksetzt. Am nächsten Tag um 14:25 Uhr hat er sich dann für die [CC-by-Lizenz](https://creativecommons.org/licenses/by/4.0/) von Creative Commons interessiert und sich am 10. März um 21:04 Uhr das [Fabric-UI-Framework](https://developer.microsoft.com/en-us/fabric) von Microsoft angeschaut. Er ist offensichtlich auch Mitglieder einer Familie bei Microsoft, denn zu selbiger hat er am nächsten Tag um 19:45 Uhr ein weiteres Mitglied hinzugefügt, um die Vorteile seines Office-365-Abos mit diesem zu teilen. Am 14. März um 11:49 Uhr hat er einen [Artikel](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/cve-2018-1000136-electron-nodeintegration-bypass/) zu einer Sicherheitslücke im Electron-Framework gelesen. Am 23. März um 17:00 Uhr hat er die Dokumentation [„Scanning The Pyramids“](https://curiositystream.com/video/1984/scanning-the-pyramids) beim Streaming-Anbieter CuriosityStream angeschaut. Den entsprechenden Vertrag dafür hat er erst eine halbe Stunde vorher, nämlich um 16:29 Uhr abgeschlossen, wobei er vom YouTuber Tom Scott angeworben wurde und sich über dessen Werbelink registriert hat. Am 25. März um 18:51 Uhr hat er sich wieder für eine Reise interessiert, diesmal über FlixBus. Die Reise hat er als einfache Fahrt zwischen Berlin und Leipzig geplant für einen Erwachsenen für den 01. Mai. Sie hat aber nie stattgefunden, es gibt nämlich keine weiteren Einträge für FlixBus. Am 22. April um 08:33 hat Benni bei Steam ein Spiel mit dem Code `5HGP6-JVK5C-I92YW` eingelöst. Am 11. Mai um 21:04 Uhr hat er sich dann im [Adobe-Forum](https://community.adobe.com/t5/premiere-pro/premiere-pro-cc-doesn-t-support-mkv-anymore/td-p/10586989?page=1) über die fehlende Unterstützung für den Export im MKV-Format in Premiere informiert. Er hat einen AWS-Account und Zugriff auf den S3-Bucket mit dem Namen `dacdn-static`. In diesem liegt die Datei mit dem Pfad `talks/subtitles/20200511-okl-berlin-en.vtt`, welche er sich am 13. Mai um 15:09 Uhr angeschaut hat.

**All diese Informationen kann Honey direkt aus den gesammelten Daten schließen.** Und das stellt natürlich nur einen kleinen Auszug der Informationen, die Honey hat, dar. Die 27 Zeilen, auf denen diese Beispiele basieren, machen gerade einmal etwas mehr als 1&nbsp;% der Datenpunkte aus, die Honey zu Benni gesammelt hat. Wir haben uns hierbei nur auf nicht-produktbezogene Seitenaufrufe beschränkt, zusätzlich kennt Honey aber eben auch noch jedes Produkt, das Benni sich angeschaut hat, während er die Erweiterung installiert hatte. Darüber hinaus ließen sich natürlich auch noch etliche weitere Analysen und Schlüsse aus den Daten ziehen. So könnte man etwa anhand der Zeitstempel Schlafzyklen und Tagesabläufe rekonstruieren oder aus den angeschauten Seiten Interessen der Nutzer_in ableiten.

<details>
<summary>Rohdaten zu den hier beschriebenen Ereignissen, wie Honey sie gespeichert hat</summary>
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

Auch bedenklich: **Honey gibt selbst an, die entsprechenden Verlaufsdaten so lange zu speichern, wie die Nutzer_in ihren Account nicht explizit löscht.**[^dauer] Und selbst dann ist nicht klar, ob tatsächlich die Verlaufsdaten gelöscht werden oder nur die Verknüpfung mit dem jeweiligen Account aufgehoben wird.

[^dauer]: In der Antwort auf die Auskunftsanfrage schreibt Honey konkret: „Honey only retains information about you as long as you keep using the Honey Services. If you delete your account, or ask us to delete it, we will no longer have any personal information attributable to you.“

### Datensammlung bei Nutzung ohne Account

Aber auch von Menschen ohne Account, die lediglich die Erweiterung nutzen, sammelt Honey die gleichen Daten. Für Malte hat sich der Anfrageprozess aber wesentlich schwieriger gestaltet. Auf seine Anfrage, in der explizit erwähnt wurde, dass er keinen Account führt und nur die Erweiterung nutzt, erhielt er zunächst nur die Antwort, dass man sein Honey-Konto nicht finden konnte und seine Anfrage daher nicht beantworten könne.

Nach einer erneuten Klarstellung durch Malte und der Bitte ihm mitzuteilen, wie er an die nötigen Identifikationsdaten für die reine Nutzung der Erweiterung ohne Account kommt, beharrte Honey darauf, in diesem Fall keine personenbezogenen Daten zu sammeln. Auch nach einem erneuten Hinweis, dass sich das Auskunftsrecht auch auf pseudonymisierte Daten erstreckt, folgte nur die Erklärung, dass die Erweiterung lediglich eine lokale ID generiere. Honey hätte aber ohne Account keinen Zugriff auf diese ID und könne die entsprechenden Daten nicht mit Malte verbinden:

> „Wenn du die Honey-Erweiterung herunterlädst, wird eine ID-Nummer erstellt und vor Ort gespeichert. Wir haben keinen Zugriff auf diese ID-Nummer und wir sind nicht in der Lage, diese Informationen zu verbinden oder diese Informationen zu identifizieren, bis ein Konto erstellt wurde.“  
> –<cite>Honey in einer E-Mail an Malte</cite>

Die meisten Nutzer_innen hätte Honey wahrscheinlich spätestens mit dieser Antwort abgehängt und sie so daran gehindert, ihr Recht auf Selbstauskunft auszuüben. Da uns Honeys Angaben aber unplausibel vorkamen, haben wir die Erweiterung analysiert. Dadurch konnten wir bestätigen, dass Honey mit jedem „Ereignis“ einen sogenannten `exv`-Wert mitsendet. Der Wert sieht beispielsweise so aus: <code style="overflow-wrap: anywhere;">ff.12.6.3.8411225708576469508.8411225706699646724</code> Er enthält den Browser (`ch` für Chrome, `ff` für Firefox), die Version der Erweiterung (z.&nbsp;B. `12.6.3`) und die eindeutigen IDs für die Person und das Gerät, wie dieser Auszug aus dem Quelltext der Honey-Erweiterung für Google Chrome (Version 12.6.3, formatiert mit den Chrome DevTools) zeigt:

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

Honey kann jedes von der Erweiterung gesendete Ereignis also sehr wohl eindeutig anhand der entsprechenden IDs zuordnen, auch wenn kein Account angelegt wurde. Das Auskunftsrecht nach der DSGVO erstreckt sich aber ebenso auf pseudonymisierte Daten[^pseudo], Honey ist also auch hier zur Auskunft verpflichtet. Erst nachdem Malte selbst herausgefunden hatte, wie er an die entsprechende ID kommt, hat Honey ihm seine Daten bereitgestellt.

[^pseudo]: vgl. etwa: Der Bayerische Landesbeauftragte für den Datenschutz, [„Das Recht auf Auskunft nach der Datenschutz-Grundverordnung: Orientierungshilfe“](https://www.datenschutz-bayern.de/verwaltung/OH_Recht_auf_Auskunft.pdf), Seite 35: „Von ihr [der Auskunftspflicht] erfasst sind dagegen pseudonymisierte Daten (Art. 4 Nr. 5 DSGVO).“

{{< img name="honey-event-report" alt="Screenshot des Firefox-Browsers. Über die DevTools wird der Netzwerktraffic der Honey-Erweiterung analysiert. Eine Anfrage an den „evs“-Endpunkt ist ausgewählt und die entsprechenden Details werden angezeigt. Die von der Erweiterung gesendeten Daten enthalten auch die Parameter „referrer_url“ mit dem Wert „https://www.ebay.com/sch/i.html?_nkw=fairphone“ und „exv“ mit dem Wert „ff.12.4.5.8409582601733493035.8409582599411239211“ (beide jeweils rot umrandet). Bei „exv“ handelt es sich um eine eindeutige ID für die Nutzer_in und aus der „referrer_url“ geht hervor, dass diese gerade bei eBay nach dem Begriff „fairphone“ gesucht hat." caption="Auch ohne die Registrierung eines Accounts meldet die Erweiterung Seitenaufrufe zusammen mit einer eindeutigen ID für die Nutzer_in an Honey, hier etwa die Suche nach einem neuen Smartphone beim Online-Händler eBay." >}}

Unsere Analyse der bereitgestellten Daten hat dann bestätigt, was wir von Anfang an vermutet haben: **Die Honey-Erweiterung meldet die gleichen Ereignisse und Verlaufsdaten an Honey zurück, unabhängig davon, ob die Nutzer_in einen Account erstellt hat oder nicht.**

## Wie sammelt Honey nach eigenen Angaben Daten? {#honeys-angaben}

Schauen wir uns nun also an, wie Honey diese Datensammlung selbst beschreibt. Die [Datenschutzerklärung](https://www.joinhoney.com/privacy/de) beginnt direkt mit einem Brief der Gründer_innen, in welchem diese bekräftigen, wie wichtig ihnen Datenschutz sei. Man erfasse nur die Daten, die zum Betrieb des Produkts nötig seien, außerdem lasse man den Nutzer_innen stets die Wahl, ob sie mit der Datenverarbeitung einverstanden sind:

> „Als Internetnutzer ist uns Datenschutz genauso wichtig [wie] Ihnen. […]
> 
> In erster Linie analysieren wir einige Informationen auf der Website des Händlers, die Sie besuchen, damit wir die besten Gutscheine für diese Website oder das Produkt ausfindig machen können. Außerdem erfassen wir beschränkte Daten des Kaufs, um die Honey-Community zu unterstützen. […]
> 
> Unsere Haltung zum Datenschutz ist einfach: Wir werden in Bezug auf die Daten, die wir [erfassen] und die Art, wie wir sie verwenden, um Ihnen Zeit und Geld zu sparen, transparent sein und Sie können entscheiden, ob Sie damit einverstanden sind.“  
> –<cite>Honey, <a href="https://www.joinhoney.com/privacy/de">„Ein Brief von unseren Gründern“</a></cite>

Dieses Versprechen wird in der [Erklärung zur Datensammlung](https://www.joinhoney.com/data-and-privacy/) näher ausgeführt. Das Erfassen bestimmter Ereignisse, welche die Nutzer_in beim Surfen generiere, werde benötigt, damit die Erweiterung funktioniert. Dabei enthielten diese Ereignisse aber in keinem Fall personenbezogene Daten:

<!-- > The extension reports back certain events to let us know when a user interacts with it or performs an action on a site that we support. These events enable core functionalities of the extension and provide information on how to improve user experience. None of the information that we collect from these events contains any personally identifiable information (PII) such as names or email addresses. Nor do we collect sensitive information such as credit card numbers, phone numbers, or passwords.   -->
> „Die Erweiterung meldet bestimmte Ereignisse zurück, um uns zu informieren, wenn ein Benutzer mit ihr interagiert oder eine Aktion auf einer von uns unterstützten Website ausführt. Diese Ereignisse ermöglichen Kernfunktionalitäten der Erweiterung und liefern Informationen darüber, wie die Benutzererfahrung verbessert werden kann. **Keine der Informationen, die wir von diesen Ereignissen erfassen, enthält personenbezogene Daten** (PII) wie Namen oder E-Mail-Adressen. Wir sammeln auch keine sensiblen Informationen wie Kreditkartennummern, Telefonnummern oder Passwörter.“  
> – <cite>Honey, <a href="https://www.joinhoney.com/data-and-privacy/">Honey’s Data Collection Policies Explained</a></cite> (übersetzt aus dem Englischen; Hervorhebung durch uns)

Etwas konkreter dazu, welche Daten denn nun tatsächlich gesammelt werden, wird es wieder in der Datenschutzerklärung:

> „Wenn Sie sich auf einer **vorab genehmigten Händlerseite** befinden, sammelt Honey Informationen über diese Website, mit denen wir die passenden Gutscheine und Angebote für Sie finden können, die Ihnen dabei helfen, Geld zu sparen. […]
> 
> *Einkaufs- und Nutzungsdaten.*
> 
> **Auf Händlerseiten erfasst Honey den Namen des Händlers, Seitenaufrufe und in einigen Fällen auch Produktinformationen**, mit denen wir Preisänderungen verfolgen und unseren Produktkatalog aktualisieren können. […]“  
> –<cite>Honey, <a href="https://www.joinhoney.com/privacy/de">„Datenschutz- und Sicherheitsrichtlinien“</a></cite> (Hervorhebungen durch uns)

Dort findet man also schließlich heraus, dass die Seitenaufrufe von Shopping-Seiten protokolliert werden. Dies beschränke sich aber ausschließlich auf Händlerseiten.

**Unsere Auswertung hat gezeigt, dass diese Angaben von Honey nicht stimmen.** Die tatsächliche Datensammlung geht weit über das Notwendige und Beschriebene hinaus. Entgegen der eigenen Angaben sammelt Honey sehr wohl in großem Maße Browser-Verlaufsdaten und andere personenbezogene Daten zu den Nutzer_innen und diese Daten beziehen sich nicht nur auf die aufgerufenen Online-Shopping-Seiten.

## Unsere Beschwerden

Wir sind der Überzeugung, dass die hier beschriebene Datenverarbeitung durch Honey viel zu weit geht, die Datensammlung ist zu umfangreich. Nach der DSGVO muss jede Verarbeitung von personenbezogenen Daten auf eine von sechs möglichen Rechtsgrundlagen gestützt sein (vgl. Art. 6 Abs. 1 DSGVO). Über diese Rechtsgrundlage muss die_der Betroffene zum Zeitpunkt der Erhebung informiert werden (vgl. Art. 13 Abs. 1 lit. c und d DSGVO). Da Honey dies aber nicht getan hat, hat Benni explizit nachgefragt und folgende Antwort erhalten:

> „Die Honey-Erweiterung sammelt Pinnwände-Daten, um zu bestimmen, welche Coupons oder Werbung angeboten werden sollen. Einfach gesagt, wir müssen wissen, auf welcher Händler-Webseite du bist, damit wir dir einen anwendbaren Deal zur Verfügung stellen können. So funktioniert Honey. Wir glauben, dass dies ein berechtigtes Interesse für diese spezielle Art der Verarbeitung darstellt. Bitte beachte außerdem, dass du die Zustimmung zur Verarbeitung zur Verfügung stellst, wenn du Honey auf deinem Browser herunterlädst und installierst.“  
> –<cite>Honey in einer E-Mail an Benni</cite>

Daraus schließen wir, dass die Verarbeitung auf Art. 6 Abs. 1 lit. a oder lit. f DSGVO gestützt werden soll. Honey beansprucht also ein berechtigtes Interesse an der Verarbeitung dieser Daten, das den Interessen und Grundrechten der betroffenen Person überwiegen würde. Weiterhin geben sie an, dass bei der Installation der Erweiterung eine Einwilligung erteilt würde. Wir glauben, dass keine der beiden Rechtsgrundlagen für die vollständige Verarbeitung ausreichend ist.

Sofern überhaupt eine korrekte Einwilligung eingeholt wurde[^keineeinwilligung], bezieht sich diese nur auf die in der Datenschutzerklärung angegebenen Zwecke. Und wie wir bereits erläutert haben, wird das Ausmaß der tatsächlichen Datensammlung dort bei weitem nicht vollständig beschrieben.  
Und auch ein berechtigtes Interesse an der Verarbeitung dieser Daten kann maximal insoweit vorliegen, wie diese tatsächlich zum Betrieb der Erweiterung nötig sind. Es ist nachvollziehbar, dass Honey die Webseite, auf der sich die Nutzer_in befindet, benötigt, um entsprechende Coupons zu finden. Wie wir gezeigt haben, werden aber auch etliche weitere Verlaufsdaten gesammelt, die mit diesem Zweck nichts mehr zu tun haben.

[^keineeinwilligung]: Unsere Überprüfung hat gezeigt, dass es möglich ist, die Honey-Erweiterung zu nutzen, ohne je eine Einwilligung erteilt zu haben. Dazu haben wir ein neues Browser-Profil angelegt und die Erweiterung installiert. Es öffnet sich zwar ein Fenster, das die Nutzer_in auffordert, einen Account anzulegen und dazu eine Einwilligung verlangt. Dieses Fenster lässt sich aber einfach schließen. Die Erweiterung funktioniert unabhängig davon und sendet vor allem trotzdem die entsprechenden Daten an Honey. Das haben wir in [diesem Video](https://static.dacdn.de/other/honey-keine-einwilligung.mp4) dokumentiert.

{{< img name="honey-registration-after-install" alt="Screenshot einer Unterseite der Honey-Webseite im Firefox-Browser. Die Seite hat die URL „https://www.joinhoney.com/welcome?onInstall=true“ und wird automatisch nach der Installation der Erweiterung aufgerufen. Die Seite trägt die Überschrift „Honey is installed!“ mit der Unterüberschrift „Now, let’s get you started by creating an account.“ Darunter sind zwei Checkboxen mit den Texten „By joining, I agree to Honey’s TOS and Privacy. Protected by reCAPTCHA and Google's Privacy and Terms.“ und „Receive news and offers from Honey by email. You can change your communication preferences in your Honey account at any time.“ Beide sind bereits ohne Interaktion mit einem Haken vorausgewählt. Darunter wiederum befinden sich Buttons mit den Aufschriften „Join with Google“, „Join with Facebook“ und „Join with PayPal“. Weitere Buttons sind im Screenshot abgeschnitten." caption="Nach der Installation der Erweiterung schlägt Honey das Anlegen eines Accounts vor, wofür eine Einwilligung verlangt wird. Diese ist bereits vorausgewählt." >}}

Und selbst wenn eine korrekte Rechtsgrundlage vorläge, ist auch die Speicherdauer in unseren Augen viel zu lang. Es lässt sich keine Notwendigkeit für eine dauerhafte Speicherung dieser sensiblen Daten erkennen. Angemessen wäre es stattdessen, die Verlaufsdaten nur kurzzeitig zu speichern und anschließend ggf. ausschließlich anonymisierte Statistiken aufzubewahren.

Schließlich hat Honey Malte zunächst sein Recht auf Datenauskunft verwehrt und fälschlicherweise behauptet, sie hätten keine Daten zu ihm gespeichert.

**Daher haben wir bei den Datenschutzaufsichtsbehörden zwei Beschwerden gegen Honey eingelegt**[^beschwerden] und die unserer Meinung nach rechtswidrige Verarbeitung geschildert. Unser Ziel damit ist es, dass Honey diese Praktiken beenden muss und für alle Nutzer_innen datenschutzfreundlicher wird. Es obliegt nun den Behörden, die Beschwerden von Benni und Malte zu prüfen. Sie haben unter anderem das Recht, Honey die entsprechenden Verarbeitungen zu verbieten oder sogar Bußgelder zu verhängen (vgl. Art. 58 Abs. 2 DSGVO).  
Die Bearbeitung unserer Beschwerden steht noch aus.

[^beschwerden]: Beide Beschwerden veröffentlichen wir: [Text der ersten Beschwerde](https://static.dacdn.de/docs/honey/beschwerde-1.pdf), [Text der zweiten Beschwerde](https://static.dacdn.de/docs/honey/beschwerde-2.pdf)

## Welche Daten hat Honey zu Dir gesammelt?

Das in diesem Artikel beschriebene Recht auf Selbstauskunft gilt natürlich auch für dich. Falls Du Honey auch benutzt und wissen möchtest, welche Daten zu Dir gesammelt wurden, kannst Du selbst eine Anfrage stellen. Das können wir Dir auch nur empfehlen: Es ist doch etwas anderes, einmal an den eigenen Daten anschaulich zu sehen, wie groß das Ausmaß der Datensammlung wirklich ist.

Hier bei Datenanfragen.de haben wir es uns zur Aufgabe gemacht, Dir die Ausübung Deiner Datenschutzrechte so einfach wie möglich zu machen. Und auch beim Anfragen Deiner Daten bei Honey wollen wir Dir natürlich helfen. Dafür haben wir extra eine {{< link slug="act/honey" text="Themenseite" >}} eingerichtet, die genau erklärt, welche Daten Du für die Anfrage brauchst und wie Du daran kommst. Anschließend musst Du die Anfrage nur noch per E-Mail abschicken – den Text haben wir schon für Dich formuliert. 

<a href="{{< ref "act/honey" >}}" class="button button-primary icon icon-email" style="float: right;">Deine Daten bei Honey anfragen</a><div class="clearfix"></div>

Und falls Du dabei feststellen solltest, dass Du mit der umfangreichen Datensammlung von Honey nicht einverstanden bist, kannst Du auch von Deinem {{< link slug="your-gdpr-rights#recht-auf-vergessenwerden" text="*Recht auf Vergessenwerden*" >}} Gebrauch machen und die Löschung Deiner Daten verlangen. Das geht ganz einfach über unseren {{< link slug="generator#!company=joinhoney" text="Generator" >}}.  
Zusätzlich kannst Du natürlich auch selbst eine Beschwerde einreichen. Wie das geht, erklären wir in unserem {{< link slug="supervisory-authorities" text="Artikel zu den Datenschutzaufsichtsbehörden" >}} – in Deutschland ist {{< link slug="supervisory-authority/debralda" text="Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg" >}}) für Honey zuständig.
