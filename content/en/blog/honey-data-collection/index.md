{
    "title": "More than just coupon codes: Browser extension Honey also collects their user’s history data",
    "type": "blog",
    "date": "2020-11-02T14:34:13+02:00",
    "description": "Our investigation shows: The free browser extension Honey doesn't just collect coupon codes. Using the GDPR's right to data access, we have confirmed that they also permanently store their user's history data on a large scale. That's why we have submitted complaints.",
    "featured_image": "honey-watches-you-while-browsing",
    "tags": [ "addon", "coupon codes", "data collection", "history data", "right to data access" ],
    "authors": [ "baltpeter" ],
    "notices": "Photo adapted after: \"[Alien Invasion](https://unsplash.com/photos/QMFZhJCufKw)\" by [Henry Mwenge](https://unsplash.com/@ayende_the_walkingman) ([Unsplash license](https://unsplash.com/license))"
}

**The free browser extension "Honey" wants to save their users money by automatically finding and applying coupon codes. They describe themselves as advocates for data protection and allegedly only collect history data on online shopping websites. Two of our members who have used Honey in the past, have asked for access to the data saved on them using the GDPR. Our analysis of the responses shows that Honey collects history data on a large scale, contrary to what their own privacy policy says. Thus, we have submitted complaints with the data protection authorities.**

{{< featuredImg alt="Photo of multiple beekeepers who watch their bees, above that the text: “Coupon code extension Honey also collects browser history data”" >}}

"Stop wasting money – Honey helps you find some of the best coupon codes on 30,000+ sites." That's how Honey describe themselves on their homepage. The free browser extension is heavily advertised on YouTube and other websites. The idea behind it is nothing new. There have been websites that collect coupon codes for various online shops for a long time.

But Honey goes one step further and wants to make this process easier for their users. Sometimes, the coupon codes found on such websites are expired or only work for certain items. Trying the different coupons codes, that are often spread across many websites, can genuinely be quite frustrating. Honey promises to do that work for their users. Once installed in the browser, the addon automatically enters all coupons it knows on the shopping cart pages of supported websites. Afterwards, it applies the one that yields the biggest savings.

Honey then earn money through so-called "affiliate marketing". The participating shops pay a commission to Honey for the coupons used.

So far, so good. But as a non-profit promoting data protection, we are mostly interested in one thing: How does Honey process their users' data? As a browser extension, Honey could in theory record all internet traffic and thus log the entire browser history. This is especially problematic as Honey is run by a US company, {{< link slug="company/joinhoney" text="Honey Science LLC" >}}, that was recently [bought by PayPal](https://help.joinhoney.com/article/302-what-does-honey-joining-paypal-mean-for-members).

## What data is actually collected?

To find out what data Honey collects, we could first take a look at their privacy policy (and, of course, [we did](#honey-privacy-policy)). But these unfortunately tend to be pretty general. They don't really give users an idea on what data is actually collected on them. Luckily, the GDPR can help here. It grants users {{< link slug="blog/your-gdpr-rights" text="extensive rights with regards to their data" >}}. One of those is the so-called *right to data access*, which is defined in Art. 15 GDPR, and allows all consumers to demand a copy of the data companies have saved on them. This makes it possible to verify a company's statements.

Two of our members, Benni and Malte, have made use of this right. They had both used the Honey extension in the past for a while. Benni had created an account and used that to log into the extension, while Malte has used the extension without an account. Both used our {{< link slug="generator" text="generator" >}} to send an access request to Honey.

We have then analysed the responses they received.

### Data collection if logged in with an account

When logged into the extension with an account, accessing the data was very easy. The response containing the data arrived within a little more than two weeks. It contained various CSV files on different topics. The first couple contained details that one would expect: the data from the user profile, country and language, the *Honey Gold* balance, a list of transactions qualifying for Honey Gold, the IP addresses and browsers used at the time of registering for an account and installing the extension.

However, it also contained a file called `PageViews.csv` that was a lot more surprising. As the name implies, this file contains a list of page views. For Benni, who used the extension from mid February 2020 to mid May 2020, it contained a staggering 2591 entries.

To give an example, one of the lines in the file looks like this (displayed as a column here for better readability):

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

We can see: **For every visit of a page in an online shop, Honey logs at least the following information**: a timestamp, multiple **unique IDs** for user, session and device, the operation system, the browser and browser version, geolocation details, and the **full URL of the visited page**.  
From that, the company gains an incredibly detailed insight into the shopping behaviour of its users. It knows not only the products that users buy but also all the products that they looked at but ultimately didn't end up buying, as well as how long they looked at the product page.

{{< img name="honey-pageviews" alt="Screenshot of a LibreOffice window. The PageViews file from Honey's response has been opened. Due to the large number of entries only a small section of the file is visible, with not even all the columns being shown." caption="The `PageViews` file gives an insight into the extent of Honey's data collection. For Benni, a total of 2591 page visits were documented, including a lot of metadata" >}}

We consider even this processing to be excessive. But it may be possible to barely justify it given that Honey's purpose is to find coupon codes for the products that users look at. But Honey collects *a lot* more data.

Indeed, not only product pages from online shops are logged. Instead, Honey saves any visit to a page whose domain the company has classified as an "online shopping website". But many shopping websites don't just include the actual product pages. They often have a multitude of other content, like blog posts or login pages.  
And Honey goes even further yet: They log page views even for subsites that are on different subdomains. Thus, the user's browsing habits on countless forums, support pages and other sites are also documented. And for all of these pages, the full URL is saved, even including the document fragment that may allow reconstructing the precise position of the page the user looked at. The logged URLs and included parameters can also contain sensitive data but in any case they allow Honey to get a detailed view into the users' browsing habits.

To demonstrate the scope of the profiles that Honey could create from this data, we have selected a few rows from Benni's data export and will now describe what information could be inferred from this. The exact raw data of the corresponding rows is published below.

Honey knows, that on February 13, 2020 at 2:57 PM, Benni looked at an [iFixit guide](https://www.ifixit.com/Guide/Nintendo+Wii+DVD+Drive+Lens+Replacement/4491) on how to swap the DVD lens on a Wii. He viewed the details for his AliExpress order `3002876007952992` a total of 13 times, starting on February 17 at 7:43 PM. He started a dispute for this order on February 25 at 10:01 AM. But before that, he went looking for an Airbnb in Berlin-Mitte on February 24 at 8:02 PM. He was looking for an entire accommodation or a hotel room for two adults for the period from March 04 to March 05. On March 01 at 6:46 PM, he looked at an [Apple support page](https://support.apple.com/en-us/HT204306) describing how to reset an iPhone if you forgot the unlock code. The next day at 2:25 PM, he was interested in the [CC-by license](https://creativecommons.org/licenses/by/4.0/) by Creative Commons and on March 10 at 9:04 PM, he looked at the [Fabric UI Framework](https://developer.microsoft.com/en-us/fabric) by Microsoft. He is apparently also a member of a Microsoft family, as he added another member to his family the next day at 7:45 PM to share the benefits of his Office 365 subscription with them. On March 14 at 11:49 AM, he read an [article](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/cve-2018-1000136-electron-nodeintegration-bypass/) on a security vulnerability in the Electron framework. On March 23 at 5 PM, he watched the documentary ["Scanning The Pyramids"](https://curiositystream.com/video/1984/scanning-the-pyramids) via the streaming provider CuriosityStream. He signed up for the service only half an hour earlier, at 4:29 PM, having been recruited by YouTuber Tom Scott and registering via his affiliate link. On March 25 at 6:51 PM, he was again interested in a trip, this time via FlixBus. He planned the trip as a one-way trip between Berlin and Leipzig for an adult on May 01. But this trip never took place, as there are no further entries for FlixBus. On April 22 at 8:33 AM, Benni redeemed a game on Steam with the code `5HGP6-JVK5C-I92YW`. On May 11 at 9:04 PM, he then informed himself about the lack of support for exporting in the MKV format in Adobe Premiere on the [Adobe support forum](https://community.adobe.com/t5/premiere-pro/premiere-pro-cc-doesn-t-support-mkv-anymore/td-p/10586989?page=1). He has an AWS account and access to the S3 bucket named `dacdn-static`. This contains a file with the path `talks/subtitles/20200511-okl-berlin-en.vtt`, which he looked at on May 13 at 3:09 PM.

**Honey can infer all this information directly from the data they collected.** And the examples we gave only represent a tiny fraction of the information that Honey has. The 27 lines that the examples are based on, only make up just over 1&nbsp;% of the entries Honey has collected on Benni. We have focussed on non-product related page views. But in addition, Honey also knows every product that Benni looked at while he had installed the extension. Further, they could use the data they have for even more conclusions and profiles. For example, they could infer sleep cycles from the timestamps or build interest profiles based on the sites that were visited.

<details>
<summary>Raw data as saved by Honey for the events described above</summary>
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

Another worrying aspect: **Honey themselves say that they keep this data as long as the user doesn't explicitly delete their account.**[^duration] And even then it isn't clear whether they will actually delete the history data or just remove the relation to the specific account.

[^duration]: In particular, Honey wrote in response to the access request: "Honey only retains information about you as long as you keep using the Honey Services. If you delete your account, or ask us to delete it, we will no longer have any personal information attributable to you."

### Data collection without an account

But Honey also collect the same data from people who just use the extension without registering for an account. For Malte, the accessing his data was a lot harder, though. The first answer to his request, which explicitly mentioned that he hadn't created an account but simply used the extension, just told him that they didn't find an account linked to him and thus weren't able to comply with his request.

Even after another clarification by Malte and him asking how to obtain the necessary identification details for users without an account, Honey insisted that they didn't have any personal data on him. When he told them that the right to access according to the GDPR also includes pseudonymised data, they claimed that the extension only generated a local ID. Without an account, they allegedly didn't have access to this ID and weren't able to connect the data to Malte:

> "If you download the Honey extension, an ID number is generated and saved locally. We don't have access to this ID number and aren't able to connect this information or identify this information [sic] until an account is created."  
> –<cite>Honey in an email to Malte</cite> (translated from the German original)

Most users would have probably given up after receiving an answer like this, Honey would have been successful in preventing them from making use of their right to access. But as Honey's statements didn't seem plausible to us, we have analysed the extension. We were able to confirm that the extensions sends a so-called `exv` value for every event it reports back to Honey. This value looks something like <code style="overflow-wrap: anywhere;">ff.12.6.3.8411225708576469508.8411225706699646724</code> and contains the browser (`ch` for Chrome, `ff` for Firefox), the extension's version (`12.6.3` for example) and unique IDs for the person and device, as this excerpt from the source code of the Honey extension for Google Chrome (version 12.6.3, formatted by the Chrome DevTools) shows:

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

Thus, Honey is absolutely able to connect any event sent by the extensions to a unique ID, even if no account was created. And as the right to access also covers pseudonymised data[^pseudo], Honey is required to comply with access requests even in this case. Only after Malte found out himself how to view the necessary IDs did Honey provide him access to his data.

[^pseudo]: see for example: The Information Commissioner’s Office, ["Is pseudonymised data still personal data?"](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/what-is-personal-data/what-is-personal-data/#pd4) in ["What is personal data?"](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/what-is-personal-data/what-is-personal-data/): "However, pseudonymisation is effectively only a security measure. It does not change the status of the data as personal data. Recital 26 makes it clear that pseudonymised personal data remains personal data and within the scope of the GDPR."

{{< img name="honey-event-report" alt="Screenshot from the Firefox browser. The network traffic of the Honey extension is being analysed via the DevTools. A request to the “evs” endpoint is selected and the relevant details are displayed. The data sent by the extension includes the parameters “referrer_url” with a value of “https://www.ebay.com/sch/i.html?_nkw=fairphone” and “exv” with a value of “ff.12.4.5.8409582601733493035.8409582599411239211” (both highlighted in red). “exv” is a unique ID for the user and the “referrer_url” allows Honey to conclude that the user just search for the term “fairphone” on eBay." caption="Even without an account, the extension reports back page views (including a unique ID) to Honey, like this search for a new smartphone at eBay." >}}

Our analysis of the data provided to Malte by Honey then confirmed what we had already assumed: **The extension reports back the same events and history data to Honey, regardless of whether you use it with or without an account.**

## How do Honey themselves describe the data collection? {#honey-privacy-policy}

So, now let's take a look at how Honey describe their data collection themselves. Their [privacy policy](https://www.joinhoney.com/privacy) starts with a letter from their founders in which they affirm their commitment to data protection. They claim to only collect data that is necessary to run their product and to always leave users a choice whether they are okay with the processing:

> "As users of the internet, we care about privacy just like you do. […]
> 
> First and foremost, we analyze some information on the retail website you’re on so that we can find the best coupons for that site or product. Also, we collect limited shopping data to support the Honey community. […]
> 
> Our stance on privacy is simple: We will be transparent with what data we collect and how we use it to save you time and money, and you can decide if you’re good with that."  
> –<cite>Honey, <a href="https://www.joinhoney.com/privacy">“A letter from our founders”</a></cite>

This promise is further explained in their [data collection policy](https://www.joinhoney.com/data-and-privacy/). There, they claim that reporting back certain events that the user generates while browsing the web was necessary for the extension to work. In any case, these events didn't contain any personal data:

> The extension reports back certain events to let us know when a user interacts with it or performs an action on a site that we support. These events enable core functionalities of the extension and provide information on how to improve user experience. **None of the information that we collect from these events contains any personally identifiable information** (PII) such as names or email addresses. Nor do we collect sensitive information such as credit card numbers, phone numbers, or passwords.  
> – <cite>Honey, <a href="https://www.joinhoney.com/data-and-privacy/">Honey’s Data Collection Policies Explained</a> (highlight by us)

The privacy policy then explains the data that is actually collected in slightly more detail:

> "When you are on a **pre-approved retail site**, to help you save money, Honey will collect information about that site that lets us know which coupons and promos to find for you. […]
> 
> *Shopping and Usage Data.*
> 
> **On retail sites, Honey collects the name of the retailer, page views, and in some cases, product information** that allows us to track price changes and update our product catalog. […]"  
> –<cite>Honey, <a href="https://www.joinhoney.com/privacy">“Honey Privacy and Security Policy”</a></cite> (highlights by us)

Here, we finally find out that page views on shopping sites are tracked. But they still claim that this only happens on shopping sites.

**Our analysis has shown that Honey's statements are not true.** The actual data collection by them far exceeds both what would be necessary and what they describe on their website. Contrary to what they say, Honey track their users' browsing history and collect their users' personal data on a large scale and this is not restricted to retail sites.

## Our complaints

We are convinced that this data collection by Honey goes way too far. According to the GDPR, every processing of personal data needs to be based on one of six possible legal bases (see Art. 6(1) GDPR). The data subject needs to be informed of the legal basis that is used at the time of the processing (see Art. 13(1)(c) and (d) GDPR). As Honey hasn't done that, Benni explicitly asked them. That's what they replied:

> "The Honey extension collect pin boards data [sic] to determine which coupons or advertisements should be offered. Simply put, we need to know on which retail website you are to offer you an applicable deal. That's how Honey works. We believe that this represents a legitimate interest for this particular form of processing. Please also note that you have give your consent to the processing when you download and install Honey in your browser."  
> –<cite>Honey in an email to Benni</cite> (translated from the German original)

From that, we conclude that Honey wants to base the processing on Art. 6(1)(a) or (f) GDPR. They claim a legitimate interest in the processing of this data that outweighs the interests and fundamental rights of the data subjects. Further, the claim that the users have given their consent to the processing when installing the add-on. We believe that neither of those provide a sufficient legal basis for the processing that Honey undertakes.

Assuming that a correct consent has even been given[^noconsent], it only applies to the purposes given in the privacy policy. And as we have already discussed, the actual extent of the data collection is definitely not properly explained there.  
Similarly, a legitimate interest can also at most be given insofar as the processing of the data is actually necessary to run the extension. It is understandable that Honey needs to know the website a user is on to find applicable coupon code. But as we have shown, they collect a lot more data that has nothing to do with this purpose.

[^noconsent]: We have proven by experiment that it is possible to install the Honey extension without ever given consent to any processing. For this, we have created a new browser profile and installed the extension. While a window opens that asks the user to create an account and give consent for that, the window can simply be closed without filling in anything. The extension still works and crucially still sends the described data to Honey. We have documented this behaviour in [this video](https://static.dacdn.de/other/honey-keine-einwilligung.mp4).

{{< img name="honey-registration-after-install" alt="Screenshot of a page on the Honey website in Firefox. The page has a URL of “https://www.joinhoney.com/welcome?onInstall=true” and was automatically opened after installing the extension. The page has a heading of “Honey is installed!” and a subheading of “Now, let’s get you started by creating an account.” Below that are two check boxes with the texts “By joining, I agree to Honey’s TOS and Privacy. Protected by reCAPTCHA and Google's Privacy and Terms.” and “Receive news and offers from Honey by email. You can change your communication preferences in your Honey account at any time.” Both are prechecked even without any user interaction. Below the check boxes are a number of buttons with the texts “Join with Google”, “Join with Facebook” and “Join with PayPal”. There are even more buttons but those are cut off in the screenshot." caption="After installing the add-on, Honey suggests to create an account for which the user needs to give their consent. The respective check box is already checked by default." >}}

And even if there was a valid legal basis, the duration of storage is way too long in our opinion. We cannot see a reason to save data this sensitive indefinitely. It would instead be appropriate to only save the browsing data temporarily and afterwards only store aggregate and anonymised statistics, if necessary.

Finally, Honey had first denied Malte his right to data access and incorrectly claimed not to have any data on him.

**Thus, we have submitted two complaints with the supervisory data protection authorities**[^complaints] and explained why we believe Honey's processing to be illegal. Our goal is to force Honey to end these practices and become more privacy-friendly for all users. It is now the authorities' job to check the complaints by Benni and Malte. Among other things, they have the right to prohibit Honey from processing the data in these ways or even impose a fine (see Art. 58(2) GDPR).  
Our complaints have yet to be processed.

[^complaints]: We are publishing the original (German) text for both complaints: [First complaint](https://static.dacdn.de/docs/honey/beschwerde-1.pdf), [second complaint](https://static.dacdn.de/docs/honey/beschwerde-2.pdf)

## What data has Honey saved on you?

The right to data access that we have talked about in this post also applies to you. If you have also used Honey and want to know what data they have collected on you, you can send a request yourself. And we definitely recommend doing that: There is quite a difference in hearing which data someone collects and actually seeing the data they have on you.

We at datarequests.org have made it our mission to make help you exercise your right to privacy. And of course, we also want to help you with your request to Honey. That's why we have put of a {{< link slug="act/honey" text="separate page" >}} that explains in detail which identification details you need for your request and how to obtain them. Afterwards, all you need to do is send the request by email—we have already written the necessary letter for you.

<a href="{{< ref "act/honey" >}}" class="button button-primary icon icon-email" style="float: right;">Request your data from Honey</a><div class="clearfix"></div>

And should you decide that you are not okay with Honey's vast data collection, you can make use of your {{< link slug="your-gdpr-rights#right-to-be-forgotten" text="*right to be forgotten*" >}} and demand the deletion of your data. You can use our {{< link slug="generator#!company=joinhoney" text="generator" >}} for that.  
Finally, you also have the right to submit a complain yourself. We explain how that works in our {{< link slug="supervisory-authorities" text="post on the supervisory authorities" >}}.
