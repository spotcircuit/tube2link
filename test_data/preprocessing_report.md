# Smart Preprocessing Report

## Statistics
- Total text length: 76,831 characters
- Pattern matches: 72
- Semantic matches: 221
- Role-based matches: 222

## Pattern-Based Content

### Steps (41 items)

**Content:**
> all right I'm going to jump into NN in a minute and actually build these alongside you and one other thing I'm going to do is I'm actually going to sign up to all the services in front of you walk you through the Authentication and the onboarding flows and get your API keys and stuff like that but just before I do want to explain very quickly the difference between a static site and then a dynamic site because if you don't know this um scraping just gets a lot harder and so we're just going to cover this in like 30 seconds and we can move on so basically um if this is you

*Context before:*
> so this video is just going to give you all the sauce you're going to learn everything you need to scrape websites like that on your own let's get into it

*Context after:*
> okay you're just this wonderful smiley person and you want to access a static website what you're doing is you're sending a request over basically to just like some document you know think about this as just like a piece of paper on a cupboard and there's a bunch of text on this piece of paper and what you do is you say hey can I have this piece of paper and then the piece of paper just comes back to you with all of the information inside of the piece of paper

**Content:**
> and then they kind of confuse it with this next step which is dynamic a dynamic site essentially is not like that at all basically what you're doing is you're sending a request to a piece of paper but the piece of paper has nothing on it

*Context before:*
> and so um this is where you know a lot of people think all websites are are at

*Context after:*
> okay what happens is this piece of paper then sends a request to some other dude which I guess in this case is just a server really who will then he has a trusty pen in his hand and he'll actually write all of the stuff on said piece of paper

**Content:**
> and and you know being practical about it so the first major way to scrape websites in NN is using direct h HTTP requests this is also what I like to think of as the Magic in scraping itself what we're going to do is we're going to use a node called the HTTP request node to send a get request to the website we want this is going to work with static websites and non JavaScript resources

*Context before:*
> so hopefully we at least understand that there's that difference between static and dynamic sites here um I'm not going to go into it more than that we're actually just going to dive in with both feet start doing a little bit of scraping and then we'll kind of see where we land I find the best way to do this stuff is just by example

*Context after:*
> so let me give you guys a website that I'm going to be scraping here this is my own site it's called left click I'm about to do a redesign

**Content:**
> and then what I'm going to do is I'm going to add three prompt I'm going to add a system prompt first I'll say you are a helpful intelligent web scraping assistant

*Context before:*
> and then what I'm going to do is I'll do the message a model just have to connect my credential here I'm assuming that you've already connected a credential if not you're going to have to go to opena website when you do the connection um and grab your API key and paste it in there's some instructions that allow you to do so right over here uh what I'm going to do is I'm going to grab the G PT 40 Mini model that's just the uh I want to say most cost effective one as of the time of this recording

*Context after:*
> then I'm going to add a user prompt and I'll say your task is to take the raw markdown of a website and convert it into structured data use the following format

**Content:**
> and then I'm going to give it an example of what I want in what's called Json JavaScript object notation format so the very first thing I'm going to do is I'm going to have it just pull out all the links on the website because I find that that's a very common scraping application so I go links

*Context before:*
> then I'm going to add a user prompt and I'll say your task is to take the raw markdown of a website and convert it into structured data use the following format

*Context after:*
> and then I'm just going to show an example of un array of we'll go absolute URLs this is very important that they're absolute URLs any thing that we're going to build after this is going to be making use of the absolute URLs not the relative URLs if you're unfamiliar with what that means if we Zoom way in here you see how there's this B uh SL left click log.png this is what's called a relative URL if you were to copy this and paste this into here this wouldn't actually do anything for us

**Content:**
> right then we have a oneline summary of the site so this is a very simple example of scraping we're scraping a static resource obviously but when I build scrapers for clients or for my own business this is always my first pass I will always just make a basic HTTP request to the resource that I'm looking at because if I can make that http request work whether it's a get request or whatever the the the rest of my life building scraper building the scraper is so easy I just take the data I process it usually using AI or some very cheap

*Context before:*
> and then we have a big chunk of plain text website copy

*Context after:*
> Tok cheap per token thing and then voila you know like we've basically built out a scraper in this case and it's only taken us what three nodes right

**Content:**
> so that's number one the second way to scrape websites in NN is using a third party service called fir crawl and making an HTTP request to it

*Context before:*
> Tok cheap per token thing and then voila you know like we've basically built out a scraper in this case and it's only taken us what three nodes right

*Context after:*
> I'm using something called their extract endpoint but just to make a long story short fire craw is a very simple but High uh bandwidth service that turns websites into large language model ready data and basically you know how earlier we had to do HTTP request

**Content:**
> I want to extract a oneline summary of the website let's do all of the text on the website all of the copy on the website in plain text let's do a oneline summary of the website a oneline Icebreaker I can use as the first line of of an of a cold email to the owner and uh the company name and a list of the services they provide let's do that this is a lot of requests we're asking it to do like seven or eight things

*Context before:*
> so um let's go from the homepage at left click.

*Context after:*
> but all I need to do in order to make this work is I click generate parameters it's going to basically now generate me a big object with a bunch of things so copy summary Icebreaker company name

**Content:**
> right so instead of just having the data available to us right now immediately what we need to do is we need to basically wait a little while wait until it's done and we need to Ping it and the reason why they've given us this ID parameter so that we could do the pinging so the way that you do this is you'd have to send a second HTTP request using this structure so the good news is we could just copy this over

*Context before:*
> and then we have a URL Trace array which is empty um if you think about this logically we don't actually get all the data that we send immediately because we need fir crawl to whip up the scraper you know do things to the data we could be feeding in 50 URLs here

*Context after:*
> and then we can add a second um HTTP request I don't know where that went

**Content:**
> and then we can add a second um HTTP request I don't know where that went

*Context before:*
> right so instead of just having the data available to us right now immediately what we need to do is we need to basically wait a little while wait until it's done and we need to Ping it and the reason why they've given us this ID parameter so that we could do the pinging so the way that you do this is you'd have to send a second HTTP request using this structure so the good news is we could just copy this over

*Context after:*
> but I guess I'm just going to create it over here I'm going to import the curl to this request just like that then keep in mind that we just need to add our API key again because the previous node had it

**Content:**
> hi Nick I came across left click I'm impressed by you help B2B Founders scale their business automation keep in mind I never gave it my name it went it found my name on the website uh and then company name left click so quick and easy way uh you're going to have access to this template obviously without my API key in it um and feel free to you know use fir craw go nuts check out their documentation build out as complex a scraping flow as need be the third way to scrape websites in nadn is using rapid API for those of you that are unfamiliar rapid API is basically a giant Marketplace of third party scrapers similar to appify which I'll cover in a moment but instead of looking for um you know building out your own scraper for a resource let's say you're wanting to scrape Instagram or something that's not a simple static site what you can do is you could just get a scraper that somebody's already developed that does specifically that using proxies and all that tough stuff that I tend to abstract away um and then you just request uh to Rapid API which automatically handles the API request to the other thing that they want and then they format it and send it all back to and then you know you have beautiful um data that you could use for basically anything so this is what rapid API looks like it's basically a big Marketplace I just pumped in a search for website over here and we see 2,97 results to give you guys some context you can do everything from you know scraping social data like emails phone numbers and stuff like that from a website you could ping the ah refs SEO API you could find uh I don't know like unofficial medium data that they don't necessarily allow people to do so this is just a quick and easy way to I guess do a first pass after you've run through fir crawl maybe that doesn't work after you've run through HTTP request that doesn't work um just do a first pass look for something that scrapes the exact resource you're looking for and then take it from there so obviously for the purpose of this I'm just going to use the website to scraper API which is sort of just like a wrapper around what we're doing right now in nadn um but this website scraper API allows you to scrape some more Dynamic data um now I'm not signed up to this

*Context before:*
> and now we have all of the data available to us automate your business in the copy field summary field left clicks an ad performance optimization agency Icebreaker

*Context after:*
> so I'm going to have to go through the signup process

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites

*Context before:*
> right like if you're scraping uh I don't know 50 every day or 100 every day or something might be a dollar or two a day which is reasonable

*Context after:*
> Dynamic sites all that fun stuff

**Content:**
> um so we're going to run through what it looks like so first thing I'm going to want to do is I'm going to want to let's just go Cloud login or sorry um start free 7-Day trial as you can see you know there's a free browser extension here if you wanted to do uh I don't know like highs scale stuff you'd choose probably their project um endpoint where we Sorry project plan where we have 5,000 URL credits we can run a bunch of tasks in parallel we could scrape Dynamic sites JavaScript sites we have a bunch of different export options then we can also just connect it directly to all of these um what I'm going to do just because I want this to kind of work as a first go is I'm just going to sign up to a free Tri here beautiful just created my account just go left click give it a phone number we'll go left click.

*Context before:*
> but I've seen a lot of people do this with naden

*Context after:*
> a we're going to go I don't know academic records needed per month we'll go 0 to th000 length of the project uh I don't know let's go two to 3 months

**Content:**
> um so we got what you're going to want to do first you're going to want to create a site map for the resource that you're going to want to scrape I'm just going to call it left click

*Context before:*
> I that'll open up Dev tools you see all the way on the right hand side here I have a couple other things like make and and cookie editor but all the way on the right hand side here we have this web scraper thing

*Context after:*
> and I just want to scrape left click.

**Content:**
> once we have our sitemap if I just give a quick little click I can then add a new selector and the really cool thing about this web scraper is um if I just zoom out a little bit here uh what you can do is you can you can select the elements on the website that you want scraped so for instance it's a very quick and easy way to do this if you think about it is like just to show you guys an example structure data is uh sort of like an e-commerce application let's say you have like the title of a product and you have like I don't know the the description of a product so on my website really quick and easy way to do this is let's just call this products and it's a type text what I'm going to do is I'm going to click select then I'll just click on this I'll click on this as well and as you see it'll automatically find all of the headings that I'm looking for so that's products we are going to then click data I'm going to click done selecting data preview as you can see it only selected one of them the very first

*Context before:*
> okay

*Context after:*
> so what we're going to want to do is go multiple

**Content:**
> and then we can set up a web hook in NN that will catch the notification get the update now we can do is we can ping um we can ping the web scraping API which I'll show you to set up in a second to request the data from that particular scraping run and from here we can take that data do whatever the heck we want with it but obviously let me show you an example of what the the actual data looks like so we just got the data from web hook let's set up an HTTP request to their API now where we basically get the ID of the thing

*Context before:*
> so we basically have everything we need now to set up a flow where we can schedule something in this web scraper service that maybe monitors some I don't know list of e-commerce product or something every 12 hours

*Context after:*
> and then we can call uh we can call that back

**Content:**
> so got my API token over here I'm going head over to their API documentation first

*Context before:*
> and then we can call uh we can call that back

*Context after:*
> okay

**Content:**
> yeah you can you can put in like a number of formats and I just wanted to give you guys an example what that looks like the next way to scrape websites in naden is using appify if you guys are no strangers to this channel you know that I do appify all the time

*Context before:*
> so

*Context after:*
> and I talk about them all the time because I think that they're just a great service um they've now given me a 30% discount where anybody can use it for I was initially under the impression it was lifetime

**Content:**
> so you probably get 30% off your first three months just check the um description if you want that

*Context before:*
> I think it's three months

*Context after:*
> but Cent how appify is is it is a Marketplace very similar to Rapid API um although extraordinarily well Main ained and they also have a ton of guides set up to help you get you know up and running with scraping any sort of application

**Content:**
> so just as we had earlier we have Instagram scrapers we have Tik Tok scrapers we have email scrapers we have map scrapers Google Maps we could do I don't know Twitter scrapers uh medium scrapers right basically any any service out there that has this Dynamic aspect to it that's not a simple HTTP request you can make you could scrape it using ampify and then obviously you you have things too like just like basic website crawlers you can generate screenshots of sites I mean there's just there's so many things let me walk you guys through what it looks like now in my case I'm not actually going to sign up to appify because I have like 400 accounts but trust me when I say it is a very easy and simple process you go to app ay.com you go get started you put in your email and your password they'll give you $5 in free platform credit you don't need any credit card and you can just get up and running and start using this for yourself super easily then the second that you have all that you'll be Creed with this screen it is a console screen don't be concerned when you see this um you know this is super simple and and easy and and not a big deal this is one of my free accounts

*Context before:*
> but Cent how appify is is it is a Marketplace very similar to Rapid API um although extraordinarily well Main ained and they also have a ton of guides set up to help you get you know up and running with scraping any sort of application

*Context after:*
> um so I just wanted to show you guys what you can do with a free account uh but from here what you do is you go to the store and as you can see I'm just dark mode all this is the same thing we were just looking at before

**Content:**
> and then I'm just going to grab like I don't know the last 10 posts okay save and start this is now going to run an actor actor is just their term for scraper which will go out it'll extract data from my Nick surve Instagram and as you can see will get a ton of fields caption owner full name owner Instagram URL comments count first comment likes count timestamp query tag we get everything from these guys which is really cool this might take you know 30 40 50 seconds we are spinning up a server in real time every time you do this as you see in bottom left hand corner there's a little memory tab which shows that we are legitimately running a server with one gigabyte of memory right now so generally my recommendation when you use appify is not to use it for oneoff requests like this feed in 5 to 10 15 20 Instagram Pages

*Context before:*
> but I'm going to feed in my Instagram here

*Context after:*
> uh but you know I just got the back

**Content:**
> but I just wanted to like allow you to see how to get data in naden really quickly now if we go to the schem of view we can see we legitimately we we already have all of the data that we we had from appify a second ago okay super easy and quick and simple to get up and running um we have the input URL field the ID field the type the short code caption now this is Instagram um every looks like we have some comments I don't have any style how do I create my man you just got to fake it till you make it

*Context before:*
> and this specific data set that I'm looking for I'll show you how to get it dynamically

*Context after:*
> I don't have any style either just some nerd in my mom's basement

**Content:**
> so it's now starting to crawl as we see here we had five requests so it should be able to do this in like the next 5 seconds

*Context before:*
> and then we're going to use it to query the the the database basically that it created for that particular Instagram run which will then enable us to do whatever the heck we want with it

*Context after:*
> or so okay

**Content:**
> so if we just go to that next HTTP request node what I can do is I can feed that in as a variable right here let going to a default data set ID drag that in between these two little lines and now we can test that step with actual live data now we have everything that we need so I don't know maybe now you want to feed this into Ai

*Context before:*
> and then we have uh let me see the data that we want would be the default data set ID down over here

*Context after:*
> and you want to have ai tell you something about the last five posts tell you

**Content:**
> I mean the options are ultimately unlimited that's why I love appify so much the sixth way to scrape websites with NN is data for Co this is another thirdparty service but it's a very high quality one that's specifically geared towards search engine optimization requests you guys haven't seen data for SEO before it's basically this big API stack that allows you to do things like automatically query a service maybe some e-commerce website or some content website and then like extract things in nicely structured formatting um again specifically for SEO purposes tons of apis here as well I mean a lot of these services are now going towards like more Marketplace style stuff

*Context before:*
> right you can now do super Dynamic and structured Outreach you could take that data and use it to like draft up your own post

*Context after:*
> but just to give you guys an example you could like Google really quickly to scrape a big list of Google search results for a term

**Content:**
> and yeah let's actually run through this the first thing that I recommend you do is go over to playground on the Le hand side there's all of their different API endpoints that you can call um what I'm going to do is I'll just go to serp for now just to show you that you could scrape Google with this pretty easily

*Context before:*
> so now you can sign in and once you're in you got also um they're actually really big on on bicycles they're training um a model to convert all ads on planet Earth into bicycles they'll actually give you a dollar worth of API access uh credits which is pretty cool um I'm not going to do that I'm just going to go over to mine which is$ 38 million bajillion dollars with 99,999 estimated days to go um

*Context after:*
> so maybe I'm in the UK and I want to scrape um let me see a keyword ni arrive

**Content:**
> right we have um the first result here it's like an organic one with some big URL a bunch of chips um I'm I have like a Knowledge Graph profile which is cool

*Context before:*
> okay then I'm going to send a request to this API there's there's a bunch of other terms here that are going to make more sense if you're a SEO person um but now we receive as output a structured object with a ton of stuff

*Context after:*
> apparently it finds it says I'm a freelance writer

**Content:**
> I just sent a request and now I receive a bunch of links with different headings and and so on and so forth that's easy the seventh way to scrape websites and Ed end is using a third party application called crawl Bas they're known for their rotating proxies which allow you to send very high volume um API requests

*Context before:*
> so you know if you wanted to do instant Pages all I'm doing is pumping that in there

*Context after:*
> so um it's very proxy driven this is their website so it's a scraping platform similar to Rapid API um and uh you know appify they support many of the major websites here and um the reason why they're so good at this is just because they you know as I mentioned they rotate the hell out of these proxies

**Content:**
> so we're going to go crawl base API we have a th000 free crawls remaining very first thing we're going to want to do is just click start crawling now just to get up and running with the API um and as you see here the these guys have probably one of the simplest apis possible all API URLs start with the folling base part click

*Context before:*
> so now we have a crawling API smart proxy thing if you guys want to run like uh I don't know use in apps that have a proxy field specifically I'm just going to keep things simple we're doing this in n8n

*Context after:*
> and then all you need to do in order to make an API call is run the following sort of line

**Content:**
> so I'm now running this and it looks like we just received a bunch of very spooky data I don't like the spooky data no spooky data for us um sometimes spooky data like this H this seems kind of weird to me actually just give me one second to make sure that's right we are receiving a data parameter back which is nice

*Context before:*
> maybe it's like a test token or something

*Context after:*
> but yeah something about this is a little bit spooky um was it a get request or was it a post request

**Content:**
> but yeah very quick and easy way to use crawl base for this now the value in crawl base is not necessarily just to send them to static websites like I talked about it's to use like highly scalable scraping where you're scraping any applications consistently um as you see here the average API response time is between 4 to 10 seconds

*Context before:*
> obviously it's just shortening and truncating it for us

*Context after:*
> so you you will receive results back pretty quick if you wanted to just send one request or 20 requests every second think about it like 20 requests a second times 60 seconds a minute is 1,200 requests times 60 minutes and an hour 72,000 requests

**Content:**
> so you you will receive results back pretty quick if you wanted to just send one request or 20 requests every second think about it like 20 requests a second times 60 seconds a minute is 1,200 requests times 60 minutes and an hour 72,000 requests

*Context before:*
> but yeah very quick and easy way to use crawl base for this now the value in crawl base is not necessarily just to send them to static websites like I talked about it's to use like highly scalable scraping where you're scraping any applications consistently um as you see here the average API response time is between 4 to 10 seconds

*Context after:*
> right um sorry just jumping around the place here you can send 72,000 requests basically an hour which is crazy um and you can do so as quickly and as easily as just like adding an API call like

**Content:**
> but if I'm not then I'll start that trial in a second what you're going to have to do in order to make this work is you're going to want to have to download you're going to want to download the octoparse desktop app

*Context before:*
> um I don't know if I have enough credits to actually do anything

*Context after:*
> so let's give it a quick and easy go just going to drag this puppy

**Content:**
> and it's also local as opposed to a lot of these other ones which are not so I'm going to Auto log in on my desktop app remember my password beautiful the simplest and easiest way to scrape a s a service is just to pump in the the URL here then click Start and basically what'll happen is um it'll actually launch like an instance of your browser here with this little tool that allow you similarly the web scraping Chrome extension select the elements on the page you want scraped so I don't know maybe I want these logos scraped the second that I tapped one you'll see it automatically found six similar elements so now I'm actually like scraping all of this stuff

*Context before:*
> so like it's cool because it's just easy to get up and running with um

*Context after:*
> okay now we have access to this sort of drag and drop or um selector thing similar to what we had before if you click on one of these you'll see it allow you to select all similar Elements which is pretty sweet

**Content:**
> so as you see I'm now mapping each of these very similarly to how I was doing before between the first field which is the title of the product and then the second field which is like the field to uh so that's pretty sweet we could do the same thing with a number of things you could extract like the headings and then the values and so on and so on and so forth but I'll kind of leave it there um so once you're done selecting all the elements that you want all you do is you click run and you have a choice between running it on your device versus running it on the cloud so um on the cloud is API supported that's how you're going to get stuff in NM

*Context before:*
> um you can also tie that to other things right

*Context after:*
> but I just want you guys to know that you can also just run it here you could run it here load up the URL scrape all the things that you want on the specific page you're feeding in

**Content:**
> um but I could also do a lot of other stuff which we'll show you in a second

*Context before:*
> so I just selected run in the cloud it's now going to open up said Cloud instances as we could see we have this little field where it's running and extracting the data we're now done so I can export this data locally

*Context after:*
> so um you can dump this automatically to Google Sheets you could do zapier to connect to Google Sheets do like some sort of web Hook connection export to cloud storage uh similar stuff to the the web scraping Chrome extension um but for now let's just export this as Json give ourselves a little ad Json file here thank you

**Content:**
> yeah now we have it locally now in order to connect with the octop par CPI what you're going to have to do is first you get up to request an access token the way that you do this is you send a post request to this URL here and the way that you format it is you need to send your username your password and then have the grantor type as password okay now password obviously just put in whatever your password is don't store it in PL text like I'm doing um with my hypothetical password put it somewhere else and then grab that data and then use it um but the the output of this is we have this big long access token variable which is great after that if I just go back to their API here um once we're here we can actually extract the data that we need so basically the thing that you're going to want is you're going to want um get data by Offset you can also use get non-exported data which is interesting so I think this just like dumps all of the data as not exported um and then sends that over to you

*Context before:*
> and

*Context after:*
> I believe

**Content:**
> so um we'll feed this in as query parameters here so send query parameters the first value was task ID second one was offset and uh offset is no Capital the third was size offset's going to be zero size going to be I don't know let's just do 1,000 and what we need now is we need the task ID of the specific run that we just finished oh in order to get the task list you head over to task list top right hand corner here task ID API

*Context before:*
> right obviously we need to feed in the task ID so you need task ID offset or size

*Context after:*
> so we now have access to this so if we go back to our NN instance we could feed that in here by test the step you'll see that we now have all the data that we just asked for earlier so a variety of ways to do this um in practice like octop par allows you to schedule runs you could schedule them um using their you know whatever it is uh uh like cloud service you could use it to scrape I don't know Twitter

**Content:**
> a I'm going to run test step we are now quering the pi and in seconds we have access to the data same thing that we had before but now we're using a pass through and browser list is a great pass through um because you know uh they they allow you to scrape things that go far beyond the usual static site thing so like honestly

*Context before:*
> and where it says your API token here I'm going to feed that in what I want as a website is just left click.

*Context after:*
> and I'm just leaving this as a secret and sort of a little I guess Easter egg for people that have made it this far in the video like my go-to when scraping websites is as I mentioned do that HTTP request trans forg that works then do something like fir C.D

**Content:**
> I hope you guys appreciated the nine best ways to scrape websites in nadn as you guys could see it's a combination of on platform scraping using the HTTP request module a lot of like API documentation stuff like that if you want to get good at this I'm releasing a master class on API stuff um uh as part of my next na tutorial video uh

*Context before:*
> and yeah let you guys kind of screw around with this on your own but there are a variety of cool applications you can use browless for all right

*Context after:*
> and then you know navigating this and then and then taking the data from these services and using them to do something that you want to do like artificial intelligence to give you a summary of the site or generate ice breakers for you or do something else um whether you're using a local application like octop parse or maybe the web scraping CH uh Chrome extension or using something like firra browserless appify rapid API and so on and so forth um you now have everything that you need in order to scrape static sites Dynamic sites super Js heavy websites and even social media websites like Tik Tok Twitter and Instagram thanks so much for making it to this point in the video if you have any suggestions for future content drop them down below more than happy to take your idea and run with it assuming it's something that I haven't done before and then if you guys could do me a really big solid like subscribe do all that fun YouTube stuff

**Content:**
> and I'll catch you on the next video thank you very much

*Context before:*
> and then you know navigating this and then and then taking the data from these services and using them to do something that you want to do like artificial intelligence to give you a summary of the site or generate ice breakers for you or do something else um whether you're using a local application like octop parse or maybe the web scraping CH uh Chrome extension or using something like firra browserless appify rapid API and so on and so forth um you now have everything that you need in order to scrape static sites Dynamic sites super Js heavy websites and even social media websites like Tik Tok Twitter and Instagram thanks so much for making it to this point in the video if you have any suggestions for future content drop them down below more than happy to take your idea and run with it assuming it's something that I haven't done before and then if you guys could do me a really big solid like subscribe do all that fun YouTube stuff

---

### Examples (11 items)

**Content:**
> so uh we're just going to go HTTP request HTTP request node looks like this we have a method field a URL field authentication field query parameters headers body and then some options down here as well all

*Context before:*
> and I'm just going to pretend that I haven't done any of this

*Context after:*
> I'm going to do is I'm just going to paste in the website that I want to visit

**Content:**
> so if we go to curl as you can see what we need to do is we need to format a request that looks something like this

*Context before:*
> and then we're going to want to turn that into basically our HTTP request let me show you what that looks like I'm just going to do all of this stuff in curl

*Context after:*
> but we need to make sure it's using the extract endpoint

**Content:**
> a just like this the prompts um because you know I was just using their playground before we're actually going to need to convert this into a request for my service

*Context before:*
> so what I'm going to do is I'm going to delete most of these I'll go back to my left click.

*Context after:*
> so I'm just going to paste The Prompt in here voila

**Content:**
> and why don't we actually run through what this would look like if we were to run a curl request you see how it's automatically just formatting it as curl well that just means we just jump back here connect this to my HTTP request module click import curl paste it in like this import

*Context before:*
> so I mean rapid AP is obviously fantastic this is a high throughput sort of thing

*Context after:*
> and it's actually going to go through and it's going to automatically map all these fields for me right query parameter URL left click.

**Content:**
> but maybe some people here aren't really familiar with it basically the way that it works is if I just paste this into like a Google sheet you see how it looks like this what what you can do is if you just um split the text to columns you kind of see how kind of see how there's like these four pettings there's web scraper order web scraper startup products and product descriptions

*Context before:*
> so just copy that over uh great and now if I run this I'm actually selecting that specific job then from here we have all the data that we just scraped as you can see there's like a uh the way that CSV Works actually let me just copy this over here I just wanted to give this to you guys as an example of a different data type

*Context after:*
> right

**Content:**
> and then I'm just going to grab like I don't know the last 10 posts okay save and start this is now going to run an actor actor is just their term for scraper which will go out it'll extract data from my Nick surve Instagram and as you can see will get a ton of fields caption owner full name owner Instagram URL comments count first comment likes count timestamp query tag we get everything from these guys which is really cool this might take you know 30 40 50 seconds we are spinning up a server in real time every time you do this as you see in bottom left hand corner there's a little memory tab which shows that we are legitimately running a server with one gigabyte of memory right now so generally my recommendation when you use appify is not to use it for oneoff requests like this feed in 5 to 10 15 20 Instagram Pages

*Context before:*
> but I'm going to feed in my Instagram here

*Context after:*
> uh but you know I just got the back

**Content:**
> um well I have a curl just like this which I can feed into um an API request that's what I'm going to do

*Context before:*
> datafor seo.com V3 _ page SL contentor parsing live that's what I'm I'm curious about you'll see that we have a post request that we need to send to this URL

*Context after:*
> so I'm going to go back over here

**Content:**
> and then once you feed it in over here where you're going to want to do is you're going to want to base 64 encode it like this they just require you to use these creds um or to operate with these creds as base 64 encoded versions Bas 64 is just a way to like translate into a slightly different number format so once you have that you would just feed in the variable right over here Ju

*Context before:*
> so that's um that's where i' get the API password from uh

*Context after:*
> Just as follows and then you can make a request to their API and receive data

**Content:**
> so I'm now running this and it looks like we just received a bunch of very spooky data I don't like the spooky data no spooky data for us um sometimes spooky data like this H this seems kind of weird to me actually just give me one second to make sure that's right we are receiving a data parameter back which is nice

*Context before:*
> maybe it's like a test token or something

*Context after:*
> but yeah something about this is a little bit spooky um was it a get request or was it a post request

**Content:**
> so the reason why that's valuable is because if you're scraping one of these websites I talked about before where when you send a simple HTTP request nothing pops up like this is the this is the purpose of this you actually feed in a JavaScript

*Context before:*
> and they give you a JavaScript um token as well

*Context after:*
> token

**Content:**
> so I should be able to jump through and show you guys what this looks like we have a verification code I'm going to paste in if you're not familiar with jumping around and stuff like this um or if you're wondering how I'm jumping around I'm just using a bunch of website hotkeys

*Context before:*
> no I haven't fantastic

*Context after:*
> okay great account is now ready

---

### Key_Points (20 items)

**Content:**
> all right I'm going to jump into NN in a minute and actually build these alongside you and one other thing I'm going to do is I'm actually going to sign up to all the services in front of you walk you through the Authentication and the onboarding flows and get your API keys and stuff like that but just before I do want to explain very quickly the difference between a static site and then a dynamic site because if you don't know this um scraping just gets a lot harder and so we're just going to cover this in like 30 seconds and we can move on so basically um if this is you

*Context before:*
> so this video is just going to give you all the sauce you're going to learn everything you need to scrape websites like that on your own let's get into it

*Context after:*
> okay you're just this wonderful smiley person and you want to access a static website what you're doing is you're sending a request over basically to just like some document you know think about this as just like a piece of paper on a cupboard and there's a bunch of text on this piece of paper and what you do is you say hey can I have this piece of paper and then the piece of paper just comes back to you with all of the information inside of the piece of paper

**Content:**
> and then they kind of confuse it with this next step which is dynamic a dynamic site essentially is not like that at all basically what you're doing is you're sending a request to a piece of paper but the piece of paper has nothing on it

*Context before:*
> and so um this is where you know a lot of people think all websites are are at

*Context after:*
> okay what happens is this piece of paper then sends a request to some other dude which I guess in this case is just a server really who will then he has a trusty pen in his hand and he'll actually write all of the stuff on said piece of paper

**Content:**
> and then what I'm going to do is I'll do the message a model just have to connect my credential here I'm assuming that you've already connected a credential if not you're going to have to go to opena website when you do the connection um and grab your API key and paste it in there's some instructions that allow you to do so right over here uh what I'm going to do is I'm going to grab the G PT 40 Mini model that's just the uh I want to say most cost effective one as of the time of this recording

*Context before:*
> so I'll go down to open Ai

*Context after:*
> and then what I'm going to do is I'm going to add three prompt I'm going to add a system prompt first I'll say you are a helpful intelligent web scraping assistant

**Content:**
> and then I'm just going to show an example of un array of we'll go absolute URLs this is very important that they're absolute URLs any thing that we're going to build after this is going to be making use of the absolute URLs not the relative URLs if you're unfamiliar with what that means if we Zoom way in here you see how there's this B uh SL left click log.png this is what's called a relative URL if you were to copy this and paste this into here this wouldn't actually do anything for us

*Context before:*
> and then I'm going to give it an example of what I want in what's called Json JavaScript object notation format so the very first thing I'm going to do is I'm going to have it just pull out all the links on the website because I find that that's a very common scraping application so I go links

*Context after:*
> right uh what we what we want is we want this instead we want left click aka the root of the domain and then um left click _ logogram and that's how we get to the actual file asset

**Content:**
> so kind of a kind of a middleman and then all I'm going to do so if I go back to my example we have an API key here which we're going to need so I'm going to go here and then paste in an API key so that's how that work works right authorization is going to be the name value is going to be bear with a capital b space

*Context before:*
> right

*Context after:*
> and then the API key

**Content:**
> and then the API key

*Context before:*
> so kind of a kind of a middleman and then all I'm going to do so if I go back to my example we have an API key here which we're going to need so I'm going to go here and then paste in an API key so that's how that work works right authorization is going to be the name value is going to be bear with a capital b space

*Context after:*
> and then we also have a body that we need to uh adjust or edit and this body is where we're going to put the links that we want to actually have scraped with the extract end point

**Content:**
> but I guess I'm just going to create it over here I'm going to import the curl to this request just like that then keep in mind that we just need to add our API key again because the previous node had it

*Context before:*
> and then we can add a second um HTTP request I don't know where that went

*Context after:*
> but this one doesn't so just going to go over here I'm going to copy this puppy go back over here I'm going to paste this in now technically what this is called is this is called polling um polling uh is where you know you're you're you're attempting to request a resource that you don't know whether or not is ready and there's a fair amount of logic that I'd recommend like putting into a polling flow where like when you try it and if it doesn't work basically you wait a certain amount of time and you retry again for the purpose of this video I'm not going to put all that stuff inside but um what I'm going to do is just set up this request I'm going to give this puppy a test let's just feed that in on the back end we got to put the extract ID right right over here where it said extract ID

**Content:**
> hi Nick I came across left click I'm impressed by you help B2B Founders scale their business automation keep in mind I never gave it my name it went it found my name on the website uh and then company name left click so quick and easy way uh you're going to have access to this template obviously without my API key in it um and feel free to you know use fir craw go nuts check out their documentation build out as complex a scraping flow as need be the third way to scrape websites in nadn is using rapid API for those of you that are unfamiliar rapid API is basically a giant Marketplace of third party scrapers similar to appify which I'll cover in a moment but instead of looking for um you know building out your own scraper for a resource let's say you're wanting to scrape Instagram or something that's not a simple static site what you can do is you could just get a scraper that somebody's already developed that does specifically that using proxies and all that tough stuff that I tend to abstract away um and then you just request uh to Rapid API which automatically handles the API request to the other thing that they want and then they format it and send it all back to and then you know you have beautiful um data that you could use for basically anything so this is what rapid API looks like it's basically a big Marketplace I just pumped in a search for website over here and we see 2,97 results to give you guys some context you can do everything from you know scraping social data like emails phone numbers and stuff like that from a website you could ping the ah refs SEO API you could find uh I don't know like unofficial medium data that they don't necessarily allow people to do so this is just a quick and easy way to I guess do a first pass after you've run through fir crawl maybe that doesn't work after you've run through HTTP request that doesn't work um just do a first pass look for something that scrapes the exact resource you're looking for and then take it from there so obviously for the purpose of this I'm just going to use the website to scraper API which is sort of just like a wrapper around what we're doing right now in nadn um but this website scraper API allows you to scrape some more Dynamic data um now I'm not signed up to this

*Context before:*
> and now we have all of the data available to us automate your business in the copy field summary field left clicks an ad performance optimization agency Icebreaker

*Context after:*
> so I'm going to have to go through the signup process

**Content:**
> uh I'm going to look for wherever it was earlier website scraper API and now check this out what we have is we have the app which is the name of the specific API that we're requesting we have an x-raid api-key and this is the API key we're going to use to make the request then we have the request URL which is basically what we're pinging and what we can do here is we can feed in the parameters

*Context before:*
> so I'm going to type website in here

*Context after:*
> okay

**Content:**
> beautiful um API key x-raid API host here's the host here's the name of the API key here's everything we need

*Context before:*
> and it's actually going to go through and it's going to automatically map all these fields for me right query parameter URL left click.

*Context after:*
> well I can actually just recreate this request now inside of NN as opposed to being on rapid API and then I have all the data accessible to me here how cool is that so we can do this for any any major website

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites

*Context before:*
> right like if you're scraping uh I don't know 50 every day or 100 every day or something might be a dollar or two a day which is reasonable

*Context after:*
> Dynamic sites all that fun stuff

**Content:**
> and then the API token if you guys remember back here on the API page you have your access to API token

*Context before:*
> I mean I hardcoded it in here just while I was doing the testing let's actually make this Dynamic now drag the scraping job ID right over here voila

*Context after:*
> so just copy that over uh great and now if I run this I'm actually selecting that specific job then from here we have all the data that we just scraped as you can see there's like a uh the way that CSV Works actually let me just copy this over here I just wanted to give this to you guys as an example of a different data type

**Content:**
> um but we're going to copy this over head back over here paste in this URL and then let me see this is a post request I think I don't actually remember so we're going to have to double check I think it's a post request

*Context before:*
> um obviously I was scraping an Instagram resource but like if you were scraping something else there'd be no change to this at all no change whatsoever now uh basically what we need in order to make this Dynamic basically make us able to run something in appify and then get it in NN so we need to set up an integration so just head over to this tab set up integration and then all you want to do is you just want to do web hook send an HTTP post web Hook when a specific actor event happens the actor event that we're going to want is basically when the run is succeeded the URL we're going to want to send this to if you think about it we just actually make another web hook request here web hook the URL we're going to want to send it to is going to be this test URL over here now I'm just going to delete all the header off stuff here because um it just uh complicates it especially for beginners

*Context after:*
> yeah

**Content:**
> so maybe I'm in the UK and I want to scrape um let me see a keyword ni arrive

*Context before:*
> and yeah let's actually run through this the first thing that I recommend you do is go over to playground on the Le hand side there's all of their different API endpoints that you can call um what I'm going to do is I'll just go to serp for now just to show you that you could scrape Google with this pretty easily

*Context after:*
> okay then I'm going to send a request to this API there's there's a bunch of other terms here that are going to make more sense if you're a SEO person um but now we receive as output a structured object with a ton of stuff

**Content:**
> um you know we have a bun bunch of data here bunch of data you know you can use this to get URLs of specific things and then with the URLs you can then feed that into scrapers um that do more like I talked about earlier maybe appify or maybe rap API maybe fir crawl so a lot of options here to like create your own very complex flows you can do other stuff as well um you grab a bunch of keyword data

*Context before:*
> apparently it finds it says I'm a freelance writer

*Context after:*
> so maybe you wanted to find a keyword and maybe again it's Nicks or location you want let's do United States that'll probably be better language um I'm just not going to select an language

**Content:**
> so maybe you wanted to find a keyword and maybe again it's Nicks or location you want let's do United States that'll probably be better language um I'm just not going to select an language

*Context before:*
> um you know we have a bun bunch of data here bunch of data you know you can use this to get URLs of specific things and then with the URLs you can then feed that into scrapers um that do more like I talked about earlier maybe appify or maybe rap API maybe fir crawl so a lot of options here to like create your own very complex flows you can do other stuff as well um you grab a bunch of keyword data

*Context after:*
> and then I'll do a request so now it's going to find us um a bunch of search volume related stuff

**Content:**
> but we have to convert it into something called base 64 um this is just how they do their API key stuff I guess it's kind of annoying

*Context before:*
> and then your password then we have to Hash it or not hash it

*Context after:*
> but it's just part and parcel of working with some apis you're just not always going to have it available to you really easily

**Content:**
> no it looks like we um we got the data from from Amazon which is pretty cool if you feed that into the markdown converter like we had before it's going to feed in the HTML here pump it into a data key we've now converted this into uh this is very long let's go tabular

*Context before:*
> so maybe we give that a go

*Context after:*
> we've now converted this into markdown which is cool and this is pretty long right obviously has all of the images and has all of the information on the site which is cool

**Content:**
> so I should be able to jump through and show you guys what this looks like we have a verification code I'm going to paste in if you're not familiar with jumping around and stuff like this um or if you're wondering how I'm jumping around I'm just using a bunch of website hotkeys

*Context before:*
> no I haven't fantastic

*Context after:*
> okay great account is now ready

**Content:**
> and it's also local as opposed to a lot of these other ones which are not so I'm going to Auto log in on my desktop app remember my password beautiful the simplest and easiest way to scrape a s a service is just to pump in the the URL here then click Start and basically what'll happen is um it'll actually launch like an instance of your browser here with this little tool that allow you similarly the web scraping Chrome extension select the elements on the page you want scraped so I don't know maybe I want these logos scraped the second that I tapped one you'll see it automatically found six similar elements so now I'm actually like scraping all of this stuff

*Context before:*
> so like it's cool because it's just easy to get up and running with um

*Context after:*
> okay now we have access to this sort of drag and drop or um selector thing similar to what we had before if you click on one of these you'll see it allow you to select all similar Elements which is pretty sweet

---

## Semantic Analysis

### Actions (220 items)

**Content:**
> hey Nick here today I'm going to show you the nine best ways to scrape any website in nadn you're going to be able to scrape static sites Dynamic sites JavaScript social media whatever the heck you want by the end of the video you'll know how to do it
*Importance score: 0.20*

**Content:**
> so this video is just going to give you all the sauce you're going to learn everything you need to scrape websites like that on your own let's get into it
*Importance score: 0.25*

**Content:**
> all right I'm going to jump into NN in a minute and actually build these alongside you and one other thing I'm going to do is I'm actually going to sign up to all the services in front of you walk you through the Authentication and the onboarding flows and get your API keys and stuff like that but just before I do want to explain very quickly the difference between a static site and then a dynamic site because if you don't know this um scraping just gets a lot harder and so we're just going to cover this in like 30 seconds and we can move on so basically um if this is you
*Importance score: 0.24*

**Content:**
> okay you're just this wonderful smiley person and you want to access a static website what you're doing is you're sending a request over basically to just like some document you know think about this as just like a piece of paper on a cupboard and there's a bunch of text on this piece of paper and what you do is you say hey can I have this piece of paper and then the piece of paper just comes back to you with all of the information inside of the piece of paper
*Importance score: 0.26*

**Content:**
> and then they kind of confuse it with this next step which is dynamic a dynamic site essentially is not like that at all basically what you're doing is you're sending a request to a piece of paper but the piece of paper has nothing on it
*Importance score: 0.19*

**Content:**
> so um there's actually that intermediate step okay where basically you are pinging some sort of uh you know domain name or whatever then that domain name shoots some code over forces a server to generate all of the contents on that domain and then you get it this is obviously kind of a two-step process and then this is a three-step process
*Importance score: 0.18*

**Content:**
> so if you just understand that um you know when you scrape a dynamic resource what you're really doing is you're sending a request to a page which sends a request back to another server which then fills your thing this element eliminates 99% of the confusion because most of the time like scraping issues are hey
*Importance score: 0.21*

**Content:**
> so hopefully we at least understand that there's that difference between static and dynamic sites here um I'm not going to go into it more than that we're actually just going to dive in with both feet start doing a little bit of scraping and then we'll kind of see where we land I find the best way to do this stuff is just by example
*Importance score: 0.22*

**Content:**
> and and you know being practical about it so the first major way to scrape websites in NN is using direct h HTTP requests this is also what I like to think of as the Magic in scraping itself what we're going to do is we're going to use a node called the HTTP request node to send a get request to the website we want this is going to work with static websites and non JavaScript resources
*Importance score: 0.23*

**Content:**
> so let me give you guys a website that I'm going to be scraping here this is my own site it's called left click I'm about to do a redesign
*Importance score: 0.26*

**Content:**
> I I did it in code and basically all this is is just a document somewhere on my or on on a server some more so what I'm going to want to do is
*Importance score: 0.22*

**Content:**
> and I'm just going to pretend that I haven't done any of this
*Importance score: 0.13*

**Content:**
> so uh we're just going to go HTTP request HTTP request node looks like this we have a method field a URL field authentication field query parameters headers body and then some options down here as well all
*Importance score: 0.16*

**Content:**
> I'm going to do is I'm just going to paste in the website that I want to visit
*Importance score: 0.26*

**Content:**
> so if I were to zoom in over here you see where it says I don't know let's let's go to my website let's just find a little bit of little bit of texture build hands off growth systems
*Importance score: 0.12*

**Content:**
> so basically what I'm trying to say is everything over here on the right hand side this is the entire site we can do anything we want with this information um and we can carry this information forward to to do any one of our any one of many flows so in my case right looking at a bunch of code isn't really very pretty so one big thing that you'll find in the vast majority of modern um scraping applications is you'll find that they'll take that HTML which we saw earlier and they'll convert it to something called markdown
*Importance score: 0.27*

**Content:**
> okay so um this is a markdown node we have a mode of HTML to markdown and all I'm going to do is I'm going to grab that data and I'm going stick it in the HTML section of the HTML to markdown converter
*Importance score: 0.19*

**Content:**
> what do you think is going to happen when I test this
*Importance score: 0.11*

**Content:**
> and I find that manipulating file formats is a big part of what makes a good scraper a good scraper so now we have something in what's called markdown format what's the value there well markdown format does two things for us one
*Importance score: 0.15*

**Content:**
> so I'll go down to open Ai
*Importance score: 0.14*

**Content:**
> and then what I'm going to do is I'll do the message a model just have to connect my credential here I'm assuming that you've already connected a credential if not you're going to have to go to opena website when you do the connection um and grab your API key and paste it in there's some instructions that allow you to do so right over here uh what I'm going to do is I'm going to grab the G PT 40 Mini model that's just the uh I want to say most cost effective one as of the time of this recording
*Importance score: 0.13*

**Content:**
> and then what I'm going to do is I'm going to add three prompt I'm going to add a system prompt first I'll say you are a helpful intelligent web scraping assistant
*Importance score: 0.29*

**Content:**
> then I'm going to add a user prompt and I'll say your task is to take the raw markdown of a website and convert it into structured data use the following format
*Importance score: 0.18*

**Content:**
> and then I'm going to give it an example of what I want in what's called Json JavaScript object notation format so the very first thing I'm going to do is I'm going to have it just pull out all the links on the website because I find that that's a very common scraping application so I go links
*Importance score: 0.24*

**Content:**
> and then I'm just going to show an example of un array of we'll go absolute URLs this is very important that they're absolute URLs any thing that we're going to build after this is going to be making use of the absolute URLs not the relative URLs if you're unfamiliar with what that means if we Zoom way in here you see how there's this B uh SL left click log.png this is what's called a relative URL if you were to copy this and paste this into here this wouldn't actually do anything for us
*Importance score: 0.19*

**Content:**
> right uh what we what we want is we want this instead we want left click aka the root of the domain and then um left click _ logogram and that's how we get to the actual file asset
*Importance score: 0.13*

**Content:**
> and then why don't we do one more thing why don't we have like a summarized or summary let's do one line summary just to show you guys you can also use AI to do other cool stuff you could take this oneline summary and feed it into some big sequence you could have ai write an icebreaker for an email you could do a things with this but I'll say on line summary um brief summarization of what the site is and how what the site is about let's do that
*Importance score: 0.19*

**Content:**
> and then the final thing is I'm going to add one more user prompt I'm just going to draw drag all of that markdown data in here then I'm going to click output content as Json I'm going to test the step I'm going to take a sip of my coffee while this puppy processes and we now have our output on the right hand side if we go to schema view what you can see is we've now generated basically an array of links on the rightand side which contains every link on this website very cool looks like the vast majority of these are type form links for some reason don't really know what's about that
*Importance score: 0.21*

**Content:**
> um anyway you could obviously just get it to Output one link or tell it like make sure all the links are unique or something um
*Importance score: 0.20*

**Content:**
> right then we have a oneline summary of the site so this is a very simple example of scraping we're scraping a static resource obviously but when I build scrapers for clients or for my own business this is always my first pass I will always just make a basic HTTP request to the resource that I'm looking at because if I can make that http request work whether it's a get request or whatever the the the rest of my life building scraper building the scraper is so easy I just take the data I process it usually using AI or some very cheap
*Importance score: 0.25*

**Content:**
> I'm using something called their extract endpoint but just to make a long story short fire craw is a very simple but High uh bandwidth service that turns websites into large language model ready data and basically you know how earlier we had to do HTTP request
*Importance score: 0.23*

**Content:**
> and then we had to convert all that stuff into markdown
*Importance score: 0.14*

**Content:**
> and then we had to you know manipulate that markdown what this does is it just does a lot of that stuff for you
*Importance score: 0.18*

**Content:**
> and then it will automatically convert text into markdown for you um so that you can do whatever the heck you want they turn it into structure data using Ai and and so on and so on and so forth
*Importance score: 0.19*

**Content:**
> so if I were to do the same thing that I just did earlier with my own website then I were to you know run an example of this what it would go do is it would basically spin up a server for me and that would actually go and generate markdown of the same format um the only difference here is it's actually generated new lines between sections of text how beautiful um
*Importance score: 0.20*

**Content:**
> and then now you know we have basically the same thing you also get it in Json which is pretty cool um and you know you can slot this into any workflow this is basically like the simple and easy way of getting started um what we're going to be showing you today is the extract endpoint which allows you to extract data just using a natural language prompt which is pretty cool and from here we're going to be able to take any URL and just turn it into structure data but we're not actually going to have to know how to parse we're not going to have to know any code we're not going to have to know any of that stuff so let me actually run through the signup process with you guys go to fire.
*Importance score: 0.28*

**Content:**
> Dev here just going to open this up in an incognito to show you guys what this looks like all you do is you just go sign up I'm going to add a password we're then going to have to validate this one
*Importance score: 0.22*

**Content:**
> because I you know I'm doing this in an incognito tab normally when you do this you're not going to have that step
*Importance score: 0.20*

**Content:**
> so what I'm going to do is I'm going to go through and just like give give this extracting point just a basic natural language query
*Importance score: 0.18*

**Content:**
> I want to extract a oneline summary of the website let's do all of the text on the website all of the copy on the website in plain text let's do a oneline summary of the website a oneline Icebreaker I can use as the first line of of an of a cold email to the owner and uh the company name and a list of the services they provide let's do that this is a lot of requests we're asking it to do like seven or eight things
*Importance score: 0.21*

**Content:**
> but all I need to do in order to make this work is I click generate parameters it's going to basically now generate me a big object with a bunch of things so copy summary Icebreaker company name
*Importance score: 0.17*

**Content:**
> and I can run this
*Importance score: 0.14*

**Content:**
> okay this is the URL it just parsed as well let's give it a run what it's doing now is it's scraping the pages using their high throughput server I just love this thing like I'm not sponsored by fire crawl or anything like that
*Importance score: 0.25*

**Content:**
> uh I don't know I just love the design I love this little like burning Ember or whatever the heck you want to call it I love how simple they've tried to make everything it's it's great
*Importance score: 0.09*

**Content:**
> oh okay links from the resource we have an icebreaker and then we have the company name as well so we can do a lot with this right
*Importance score: 0.18*

**Content:**
> but right now this is just um this is just on on a website how do we actually bring this in naden
*Importance score: 0.20*

**Content:**
> uh well it's pretty simple as you see there's an integrate Now button you can either get code or you can use it in zap here basically what we're going to want to do is we're going to want to run a request to um their endpoint
*Importance score: 0.23*

**Content:**
> and then we're going to want to turn that into basically our HTTP request let me show you what that looks like I'm just going to do all of this stuff in curl
*Importance score: 0.27*

**Content:**
> so if we go to curl as you can see what we need to do is we need to format a request that looks something like this
*Importance score: 0.23*

**Content:**
> but we need to make sure it's using the extract endpoint
*Importance score: 0.20*

**Content:**
> so I'm going to go down to extract
*Importance score: 0.17*

**Content:**
> and then now I have this big long beautiful string what I'm going to do is I'm going to copy this
*Importance score: 0.19*

**Content:**
> and then what I need to do is just open up an HTTP request module and then click import curl just paste all the stuff inside now this is an example request
*Importance score: 0.20*

**Content:**
> dv1 extract so basically what we're doing now is we're like we're sending a request to fir craw which will then send a request to the website
*Importance score: 0.23*

**Content:**
> so kind of a kind of a middleman and then all I'm going to do so if I go back to my example we have an API key here which we're going to need so I'm going to go here and then paste in an API key so that's how that work works right authorization is going to be the name value is going to be bear with a capital b space
*Importance score: 0.17*

**Content:**
> so what I'm going to do is I'm going to delete most of these I'll go back to my left click.
*Importance score: 0.20*

**Content:**
> so we're going to go summary type string then Icebreaker it's going to be Icebreaker type string then guess what we have last but not least company name which is going to be type string we're also going to want to make these fields required like uh you know you can set it up so they're not actually required when you do a request
*Importance score: 0.17*

**Content:**
> logically maybe not all the websites we're going to be scraping using this service are going to have the company names visible on the website I don't know
*Importance score: 0.23*

**Content:**
> so now we have the API request formatted correctly um all we need to do at this point is just click test step it looks like we're getting a Json breaking um error
*Importance score: 0.19*

**Content:**
> and I'm just going to check to see if there are any commas in Jason you can't actually have the last element in an array have a comma on it
*Importance score: 0.07*

**Content:**
> and then we have a URL Trace array which is empty um if you think about this logically we don't actually get all the data that we send immediately because we need fir crawl to whip up the scraper you know do things to the data we could be feeding in 50 URLs here
*Importance score: 0.23*

**Content:**
> right so instead of just having the data available to us right now immediately what we need to do is we need to basically wait a little while wait until it's done and we need to Ping it and the reason why they've given us this ID parameter so that we could do the pinging so the way that you do this is you'd have to send a second HTTP request using this structure so the good news is we could just copy this over
*Importance score: 0.18*

**Content:**
> and then we can add a second um HTTP request I don't know where that went
*Importance score: 0.22*

**Content:**
> but this one doesn't so just going to go over here I'm going to copy this puppy go back over here I'm going to paste this in now technically what this is called is this is called polling um polling uh is where you know you're you're you're attempting to request a resource that you don't know whether or not is ready and there's a fair amount of logic that I'd recommend like putting into a polling flow where like when you try it and if it doesn't work basically you wait a certain amount of time and you retry again for the purpose of this video I'm not going to put all that stuff inside but um what I'm going to do is just set up this request I'm going to give this puppy a test let's just feed that in on the back end we got to put the extract ID right right over here where it said extract ID
*Importance score: 0.25*

**Content:**
> then I'm just going to give this a test uh looks like I've issued a malformed request we just have to make sure that everything here is okay specify body let me just make sure there's nothing else in here it was a get request this is a get cool
*Importance score: 0.25*

**Content:**
> and now we have all of the data available to us automate your business in the copy field summary field left clicks an ad performance optimization agency Icebreaker
*Importance score: 0.22*

**Content:**
> hi Nick I came across left click I'm impressed by you help B2B Founders scale their business automation keep in mind I never gave it my name it went it found my name on the website uh and then company name left click so quick and easy way uh you're going to have access to this template obviously without my API key in it um and feel free to you know use fir craw go nuts check out their documentation build out as complex a scraping flow as need be the third way to scrape websites in nadn is using rapid API for those of you that are unfamiliar rapid API is basically a giant Marketplace of third party scrapers similar to appify which I'll cover in a moment but instead of looking for um you know building out your own scraper for a resource let's say you're wanting to scrape Instagram or something that's not a simple static site what you can do is you could just get a scraper that somebody's already developed that does specifically that using proxies and all that tough stuff that I tend to abstract away um and then you just request uh to Rapid API which automatically handles the API request to the other thing that they want and then they format it and send it all back to and then you know you have beautiful um data that you could use for basically anything so this is what rapid API looks like it's basically a big Marketplace I just pumped in a search for website over here and we see 2,97 results to give you guys some context you can do everything from you know scraping social data like emails phone numbers and stuff like that from a website you could ping the ah refs SEO API you could find uh I don't know like unofficial medium data that they don't necessarily allow people to do so this is just a quick and easy way to I guess do a first pass after you've run through fir crawl maybe that doesn't work after you've run through HTTP request that doesn't work um just do a first pass look for something that scrapes the exact resource you're looking for and then take it from there so obviously for the purpose of this I'm just going to use the website to scraper API which is sort of just like a wrapper around what we're doing right now in nadn um but this website scraper API allows you to scrape some more Dynamic data um now I'm not signed up to this
*Importance score: 0.25*

**Content:**
> but yeah we're going to we're going to run through an API request to Rapid API which is going to make this a lot easier just going to put in all of my information here
*Importance score: 0.30*

**Content:**
> and then I'm going to do the classic email verification
*Importance score: 0.19*

**Content:**
> thank you rise I use a time management app called rise and every time I go on my Gmail I set my Gmail up as like a definitely do not uh do during your workday let's just call it personal projects they don't ask me all these questions my goal today is to browse available apis awesome
*Importance score: 0.19*

**Content:**
> uh I'm going to look for wherever it was earlier website scraper API and now check this out what we have is we have the app which is the name of the specific API that we're requesting we have an x-raid api-key and this is the API key we're going to use to make the request then we have the request URL which is basically what we're pinging and what we can do here is we can feed in the parameters
*Importance score: 0.23*

**Content:**
> and then we can actually just like give it give it a run
*Importance score: 0.11*

**Content:**
> and I'm going to pay money per month that probably seems the simplest way to do
*Importance score: 0.14*

**Content:**
> and I just ran through the payment let's actually head over here and let's just run a test using my website URL we're going to test this endpoint now and now this actually going to go through Rapid API it's going to spin up the server
*Importance score: 0.21*

**Content:**
> and then it's going to send it and what we see here is we have multiple fields that Rapid apis or this particular scraper gives us let me just make this easier for you all to see we have a text content field with all of the content of the website which is cool this is basically what I did earlier um but instead of me having to formulate this request try and parse it and try and use AI tokens what I did is I sent the request to uh rapid API and did it all for me then we also have an HTML content field I think we have one more here scroll all the way down to the bottom as you can see there is a ton of HTML
*Importance score: 0.29*

**Content:**
> um and then we also have a list of all of the images on the website which is very very cool and easily formatted again something that I tried to do manually using AI
*Importance score: 0.22*

**Content:**
> and then if they find any social media links I don't believe um there were more than Twitter
*Importance score: 0.10*

**Content:**
> and why don't we actually run through what this would look like if we were to run a curl request you see how it's automatically just formatting it as curl well that just means we just jump back here connect this to my HTTP request module click import curl paste it in like this import
*Importance score: 0.21*

**Content:**
> well I can actually just recreate this request now inside of NN as opposed to being on rapid API and then I have all the data accessible to me here how cool is that so we can do this for any any major website
*Importance score: 0.28*

**Content:**
> really um you know there are a lot of specific bespoke scrapers obviously which um I don't know if you wanted to scrape uh let's go back to Discovery if you wanted to scrape like Instagram or something you could scrape um Instagram uh you could do like Facebook scraping you could scrape these large giants that are quite difficult to do
*Importance score: 0.25*

**Content:**
> So Meta ad Library Facebook ad scraper and depending on the plan that you're at it might be more cost- effective for you to sign up to some sort of monthly recurring thing rather than just pay two cents every single time you make one of these requests you just kind of got to do that determination yourself
*Importance score: 0.20*

**Content:**
> right like if you're scraping uh I don't know 50 every day or 100 every day or something might be a dollar or two a day which is reasonable
*Importance score: 0.14*

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites
*Importance score: 0.25*

**Content:**
> and then you can um export that data as a cloud run to then send back sorry big sneeze to then send back to some API or some service um and then automatically do parsing and stuff like that so very cool I'm going to show you guys what that looks like um this is sort of a more customized way to build the stuff
*Importance score: 0.24*

**Content:**
> but I've seen a lot of people do this with naden
*Importance score: 0.08*

**Content:**
> um so we're going to run through what it looks like so first thing I'm going to want to do is I'm going to want to let's just go Cloud login or sorry um start free 7-Day trial as you can see you know there's a free browser extension here if you wanted to do uh I don't know like highs scale stuff you'd choose probably their project um endpoint where we Sorry project plan where we have 5,000 URL credits we can run a bunch of tasks in parallel we could scrape Dynamic sites JavaScript sites we have a bunch of different export options then we can also just connect it directly to all of these um what I'm going to do just because I want this to kind of work as a first go is I'm just going to sign up to a free Tri here beautiful just created my account just go left click give it a phone number we'll go left click.
*Importance score: 0.26*

**Content:**
> a we're going to go I don't know academic records needed per month we'll go 0 to th000 length of the project uh I don't know let's go two to 3 months
*Importance score: 0.11*

**Content:**
> so now we can import and run our own site map or we can use a premade Community sit map um what I'm going to do is I'm just going to import this we're then going to get the Chrome extension web scraper let me add that extension and it's going to download it do all that fun stuff beautiful
*Importance score: 0.25*

**Content:**
> a open up this puppy now there's a bunch of like tutorials and how to use this stuff um that's not that big of a deal but basically the thing you need is you need to hold command plus option plus I to open up your developer tools and you'll just find it on the in my case the far right
*Importance score: 0.16*

**Content:**
> um so we got what you're going to want to do first you're going to want to create a site map for the resource that you're going to want to scrape I'm just going to call it left click
*Importance score: 0.25*

**Content:**
> once we have our sitemap if I just give a quick little click I can then add a new selector and the really cool thing about this web scraper is um if I just zoom out a little bit here uh what you can do is you can you can select the elements on the website that you want scraped so for instance it's a very quick and easy way to do this if you think about it is like just to show you guys an example structure data is uh sort of like an e-commerce application let's say you have like the title of a product and you have like I don't know the the description of a product so on my website really quick and easy way to do this is let's just call this products and it's a type text what I'm going to do is I'm going to click select then I'll just click on this I'll click on this as well and as you see it'll automatically find all of the headings that I'm looking for so that's products we are going to then click data I'm going to click done selecting data preview as you can see it only selected one of them the very first
*Importance score: 0.18*

**Content:**
> so what we're going to want to do is go multiple
*Importance score: 0.14*

**Content:**
> I'll go multiple data preview just to make sure that it looks good I'm getting no data extracted here
*Importance score: 0.17*

**Content:**
> oh sorry I didn't actually select the um didn't actually finish it now we're getting product descriptions that's pretty cool um this is me doing this sort of like one at a time you can also um group
*Importance score: 0.19*

**Content:**
> okay great once we have this um what I can do is I can actually go export sitemap so now I have all of the code on the website that actually goes and finds it for me then I can paste this in here
*Importance score: 0.19*

**Content:**
> I'll just call this left click scraper and I'm going to import this to my cloud scraper uh I think I'm running into
*Importance score: 0.28*

**Content:**
> I don't think we can do a space there my bad just call it left click and now what we can do is we can actually just like run a server instance that goes out and then scrapes this for us
*Importance score: 0.25*

**Content:**
> so I'm going to click scrape it looks like I need to verify my email so just make sure you do that before you try and get ahead of yourself like I was okay looks like we just verified the email let's head back over here refresh then scrape
*Importance score: 0.23*

**Content:**
> okay I just gave this a refresh and as we see we have now finished said scraping job we have all of the data available to us using their UI but now that we've gone through this process of you know building out this this thing um how do we actually take that and then use it in our nadn flows so variety of ways um if you wanted to connect this let's say to specific service like Dropbox um Google you know dump anow or something Google Drive I'd recommend just doing it directly through their integration it's just a lot easier to get the data there
*Importance score: 0.27*

**Content:**
> and then you can just connect it to n and watch the data as it comes in or something you can also use the web scraper API uh this is pretty neat because you can you know that's what we're going to end up using it was pretty neat because you can uh like schedule jobs you can send jobs you can do basically everything just through the NN interface
*Importance score: 0.25*

**Content:**
> and then we can set like a web hook URL where we we receive the request so um let me check we need a scraping for testing you need a scraping job that has already been finished I think our scraping job has already been finished I'm just going to go htps uh back to my n8n flow I'm actually going to build an n8n web hook give that a click I'm not going to have any authentication let me just turn all this off basically what we want is we we want to use this as our test event we're going to go back to the API paste this in save
*Importance score: 0.26*

**Content:**
> so we basically have everything we need now to set up a flow where we can schedule something in this web scraper service that maybe monitors some I don't know list of e-commerce product or something every 12 hours
*Importance score: 0.23*

**Content:**
> and then we can set up a web hook in NN that will catch the notification get the update now we can do is we can ping um we can ping the web scraping API which I'll show you to set up in a second to request the data from that particular scraping run and from here we can take that data do whatever the heck we want with it but obviously let me show you an example of what the the actual data looks like so we just got the data from web hook let's set up an HTTP request to their API now where we basically get the ID of the thing
*Importance score: 0.22*

**Content:**
> so got my API token over here I'm going head over to their API documentation first
*Importance score: 0.25*

**Content:**
> and then what we want to do is download these scrape data in CSV format at least in my case I imagine most of you guys are going to add this to a spreadsheet or whatever um you can very easily do whatever you want there's also a Json format endpoint here
*Importance score: 0.24*

**Content:**
> um but let's just do CSV for Simplicity
*Importance score: 0.18*

**Content:**
> so I've already gone ahead and I've gotten the method which was a get request so I've added that up here the URL was this over here with the scraping job ID and then your API token there so what I've done is I've grabbed the API token and the scraping job ID
*Importance score: 0.15*

**Content:**
> I mean I hardcoded it in here just while I was doing the testing let's actually make this Dynamic now drag the scraping job ID right over here voila
*Importance score: 0.21*

**Content:**
> so just copy that over uh great and now if I run this I'm actually selecting that specific job then from here we have all the data that we just scraped as you can see there's like a uh the way that CSV Works actually let me just copy this over here I just wanted to give this to you guys as an example of a different data type
*Importance score: 0.20*

**Content:**
> but maybe some people here aren't really familiar with it basically the way that it works is if I just paste this into like a Google sheet you see how it looks like this what what you can do is if you just um split the text to columns you kind of see how kind of see how there's like these four pettings there's web scraper order web scraper startup products and product descriptions
*Importance score: 0.21*

**Content:**
> yeah you can you can put in like a number of formats and I just wanted to give you guys an example what that looks like the next way to scrape websites in naden is using appify if you guys are no strangers to this channel you know that I do appify all the time
*Importance score: 0.28*

**Content:**
> so you probably get 30% off your first three months just check the um description if you want that
*Importance score: 0.09*

**Content:**
> but Cent how appify is is it is a Marketplace very similar to Rapid API um although extraordinarily well Main ained and they also have a ton of guides set up to help you get you know up and running with scraping any sort of application
*Importance score: 0.23*

**Content:**
> so just as we had earlier we have Instagram scrapers we have Tik Tok scrapers we have email scrapers we have map scrapers Google Maps we could do I don't know Twitter scrapers uh medium scrapers right basically any any service out there that has this Dynamic aspect to it that's not a simple HTTP request you can make you could scrape it using ampify and then obviously you you have things too like just like basic website crawlers you can generate screenshots of sites I mean there's just there's so many things let me walk you guys through what it looks like now in my case I'm not actually going to sign up to appify because I have like 400 accounts but trust me when I say it is a very easy and simple process you go to app ay.com you go get started you put in your email and your password they'll give you $5 in free platform credit you don't need any credit card and you can just get up and running and start using this for yourself super easily then the second that you have all that you'll be Creed with this screen it is a console screen don't be concerned when you see this um you know this is super simple and and easy and and not a big deal this is one of my free accounts
*Importance score: 0.26*

**Content:**
> um so I just wanted to show you guys what you can do with a free account uh but from here what you do is you go to the store and as you can see I'm just dark mode all this is the same thing we were just looking at before
*Importance score: 0.18*

**Content:**
> and then um we're just going to run a test on the thing that we want to scrape
*Importance score: 0.24*

**Content:**
> so what I'm going to want to do is for the purposes of this I'm now going to do something different from what I was doing before like which was just left click over and over and
*Importance score: 0.20*

**Content:**
> over I think that kind of gets boring what I'm going to do is I'm going to scrape Instagram posts
*Importance score: 0.23*

**Content:**
> so what I'm going to do is I'm going to feed in a name nickf this is just my um Instagram uh which almost hit 10K in God like 15 days or something like that
*Importance score: 0.18*

**Content:**
> and then I'm just going to grab like I don't know the last 10 posts okay save and start this is now going to run an actor actor is just their term for scraper which will go out it'll extract data from my Nick surve Instagram and as you can see will get a ton of fields caption owner full name owner Instagram URL comments count first comment likes count timestamp query tag we get everything from these guys which is really cool this might take you know 30 40 50 seconds we are spinning up a server in real time every time you do this as you see in bottom left hand corner there's a little memory tab which shows that we are legitimately running a server with one gigabyte of memory right now so generally my recommendation when you use appify is not to use it for oneoff requests like this feed in 5 to 10 15 20 Instagram Pages
*Importance score: 0.23*

**Content:**
> um so the question is obviously how do you get this in NN well appify has a really easy to use um API which I like doing all you have is if we wanted to get the uh let's see get data set items
*Importance score: 0.15*

**Content:**
> okay all I'm going to do is I'm just going to copy this go back here and then connect this to an HTTP request module as you could see we have this big long field here with my API appify API token
*Importance score: 0.20*

**Content:**
> but I just wanted to like allow you to see how to get data in naden really quickly now if we go to the schem of view we can see we legitimately we we already have all of the data that we we had from appify a second ago okay super easy and quick and simple to get up and running um we have the input URL field the ID field the type the short code caption now this is Instagram um every looks like we have some comments I don't have any style how do I create my man you just got to fake it till you make it
*Importance score: 0.25*

**Content:**
> I don't have any style either just some nerd in my mom's basement
*Importance score: 0.05*

**Content:**
> um obviously I was scraping an Instagram resource but like if you were scraping something else there'd be no change to this at all no change whatsoever now uh basically what we need in order to make this Dynamic basically make us able to run something in appify and then get it in NN so we need to set up an integration so just head over to this tab set up integration and then all you want to do is you just want to do web hook send an HTTP post web Hook when a specific actor event happens the actor event that we're going to want is basically when the run is succeeded the URL we're going to want to send this to if you think about it we just actually make another web hook request here web hook the URL we're going to want to send it to is going to be this test URL over here now I'm just going to delete all the header off stuff here because um it just uh complicates it especially for beginners
*Importance score: 0.23*

**Content:**
> um but we're going to copy this over head back over here paste in this URL and then let me see this is a post request I think I don't actually remember so we're going to have to double check I think it's a post request
*Importance score: 0.24*

**Content:**
> and then what I'm going to do is I'm going to listen for a test event run the test web hook so we're listening we're making a get request
*Importance score: 0.22*

**Content:**
> so the fact that it hasn't connected yet probably tells me it's a post request so let's move over here move this down to post now let's listen to a test event let's run this puppy one more time so we just dispatched it
*Importance score: 0.17*

**Content:**
> so I'm going to listen for this test event I'm going to run the same scraper again maybe we'll make it five posts per profile just to make it a little faster and um once this is done what it's going to do is it's going to send a record of all the information we need to get the data over to Ann we're going to catch that information
*Importance score: 0.26*

**Content:**
> and then we're going to use it to query the the the database basically that it created for that particular Instagram run which will then enable us to do whatever the heck we want with it
*Importance score: 0.22*

**Content:**
> so it's now starting to crawl as we see here we had five requests so it should be able to do this in like the next 5 seconds
*Importance score: 0.27*

**Content:**
> and once that's done we now have an actor succeeded event um
*Importance score: 0.07*

**Content:**
> and then we have uh let me see the data that we want would be the default data set ID down over here
*Importance score: 0.22*

**Content:**
> so if we just go to that next HTTP request node what I can do is I can feed that in as a variable right here let going to a default data set ID drag that in between these two little lines and now we can test that step with actual live data now we have everything that we need so I don't know maybe now you want to feed this into Ai
*Importance score: 0.19*

**Content:**
> right you can now do super Dynamic and structured Outreach you could take that data and use it to like draft up your own post
*Importance score: 0.19*

**Content:**
> I mean the options are ultimately unlimited that's why I love appify so much the sixth way to scrape websites with NN is data for Co this is another thirdparty service but it's a very high quality one that's specifically geared towards search engine optimization requests you guys haven't seen data for SEO before it's basically this big API stack that allows you to do things like automatically query a service maybe some e-commerce website or some content website and then like extract things in nicely structured formatting um again specifically for SEO purposes tons of apis here as well I mean a lot of these services are now going towards like more Marketplace style stuff
*Importance score: 0.21*

**Content:**
> and then you could like feed that into one of any of the other scrapers that we set up here to get data on stuff you could go Google Images Google Maps you could do Bing BYO YouTube Google's uh their own data set feature I don't really know what that is
*Importance score: 0.23*

**Content:**
> uh and then you can you can take this data and do really fun stuff with it
*Importance score: 0.23*

**Content:**
> so I'm just going to click try for free over here in the top right hand corner show you guys what that looks like and as you see here um I signed in to data for SEO to my own account looks like I have 38 million bajillion dollars
*Importance score: 0.24*

**Content:**
> so why don't actually just do that with you
*Importance score: 0.14*

**Content:**
> and then I'll just use that account that is 38 million bajillion dollars we'll click try for free we'll go Nikki Wiki uh let's use a different email I need a business email
*Importance score: 0.18*

**Content:**
> okay I do agree to the terms of use absolutely uh bicycle is that a bicycle that's not a bicycle what does it mean when I can't answer these does it mean that I'm a robot if you look at some of my posts some of my comments people would absolutely say yes it means that that you're a robot um I don't know why people keep saying stuff like dude Nick nice AI Avatar bro
*Importance score: 0.09*

**Content:**
> so I need to activate my account doesn't look like it allows you to feed in the code here so I'm just going to feed it in myself
*Importance score: 0.25*

**Content:**
> uh it's obviously you're getting a lot of spammers hence this um bicycle stuff I don't know why the code isn't working here let me just copy this link address paste it in here instead there you go
*Importance score: 0.18*

**Content:**
> so now you can sign in and once you're in you got also um they're actually really big on on bicycles they're training um a model to convert all ads on planet Earth into bicycles they'll actually give you a dollar worth of API access uh credits which is pretty cool um I'm not going to do that I'm just going to go over to mine which is$ 38 million bajillion dollars with 99,999 estimated days to go um
*Importance score: 0.20*

**Content:**
> and yeah let's actually run through this the first thing that I recommend you do is go over to playground on the Le hand side there's all of their different API endpoints that you can call um what I'm going to do is I'll just go to serp for now just to show you that you could scrape Google with this pretty easily
*Importance score: 0.25*

**Content:**
> um you know we have a bun bunch of data here bunch of data you know you can use this to get URLs of specific things and then with the URLs you can then feed that into scrapers um that do more like I talked about earlier maybe appify or maybe rap API maybe fir crawl so a lot of options here to like create your own very complex flows you can do other stuff as well um you grab a bunch of keyword data
*Importance score: 0.22*

**Content:**
> so maybe you wanted to find a keyword and maybe again it's Nicks or location you want let's do United States that'll probably be better language um I'm just not going to select an language
*Importance score: 0.10*

**Content:**
> and then I'll do a request so now it's going to find us um a bunch of search volume related stuff
*Importance score: 0.22*

**Content:**
> so I don't actually know how many people are searching for me in 2025 apparently 390 is this per month H wonder if it's per month per day that's interesting uh I don't really know why they break it down by like the month date
*Importance score: 0.11*

**Content:**
> yeah looks like it's 390 per month so to the 390 people that are Googling me who are you and what do you want I'm just kidding um you can do things like you could find back links so you could find links um for I believe you feed in a website URL and then it finds back links to that website so this is you technically now scraping a bunch of other websites looking for links to the specific resource that you have that's kind of neat it looks like that found it basically immediately which is really really cool
*Importance score: 0.24*

**Content:**
> and it looks like they're referring top level links that are Dooms BG bgs would be interesting I wonder where that's coming from um there's a Content generation API playground
*Importance score: 0.18*

**Content:**
> but let's actually turn this into an API call if we head over to the API of do data for SEO so in my case docs.
*Importance score: 0.24*

**Content:**
> um well I have a curl just like this which I can feed into um an API request that's what I'm going to do
*Importance score: 0.28*

**Content:**
> AI um and then we have sort of like a gacha here that a lot of people don't understand this is the um authorization the authorization is a little bit different from most of the easy authorizations we've had so far we actually have to convert it
*Importance score: 0.17*

**Content:**
> um we have to go one one more step basically to make this work if I check out the let's see um authorization here what we need is we need to um get the login and then the P
*Importance score: 0.13*

**Content:**
> but we have to convert it into something called base 64 um this is just how they do their API key stuff I guess it's kind of annoying
*Importance score: 0.17*

**Content:**
> but it's just part and parcel of working with some apis you're just not always going to have it available to you really easily
*Importance score: 0.23*

**Content:**
> so what we need to do is we need to base 64 encode the username and the password um I'm just going to leave that at what I've done is I've actually gone through and done it in this edit Fields node um basically what you need to do is you need to have your username or your login
*Importance score: 0.09*

**Content:**
> and then once you feed it in over here where you're going to want to do is you're going to want to base 64 encode it like this they just require you to use these creds um or to operate with these creds as base 64 encoded versions Bas 64 is just a way to like translate into a slightly different number format so once you have that you would just feed in the variable right over here Ju
*Importance score: 0.10*

**Content:**
> Just as follows and then you can make a request to their API and receive data
*Importance score: 0.24*

**Content:**
> so uh it looks like I was doing their content parsing live you know what I wanted to do is I just wanted to call their endpoint which I think was their like instant Pages this one right over here
*Importance score: 0.27*

**Content:**
> you're literally doing is just swapping out the requests
*Importance score: 0.22*

**Content:**
> so you know if you wanted to do instant Pages all I'm doing is pumping that in there
*Importance score: 0.20*

**Content:**
> I'll use my business email here and then continue with Emil email we got to add a phone number obviously we're going to do less than a thousand
*Importance score: 0.16*

**Content:**
> I'm a CTO I don't want to what's the animal right is that an animal
*Importance score: 0.10*

**Content:**
> yes it's an animal good God beep boop uh we're going to head over to my Gmail and receive this now so we need to confirm my account just going to copy this link address that I can do this in one page
*Importance score: 0.19*

**Content:**
> we should be good to log in so that's what's happening we need to select the animal again just doesn't it doesn't believe really just doesn't believe okay
*Importance score: 0.14*

**Content:**
> so now we have a crawling API smart proxy thing if you guys want to run like uh I don't know use in apps that have a proxy field specifically I'm just going to keep things simple we're doing this in n8n
*Importance score: 0.21*

**Content:**
> so we're going to go crawl base API we have a th000 free crawls remaining very first thing we're going to want to do is just click start crawling now just to get up and running with the API um and as you see here the these guys have probably one of the simplest apis possible all API URLs start with the folling base part click
*Importance score: 0.23*

**Content:**
> and then all you need to do in order to make an API call is run the following sort of line
*Importance score: 0.21*

**Content:**
> so well I'm going to import it as you can see here we have a token field then we just have the URL field of the place we want to crawl so I'm going to do left click.
*Importance score: 0.25*

**Content:**
> for now um I don't know if this token field was actually my real token
*Importance score: 0.17*

**Content:**
> I don't believe so maybe we'll give it a try
*Importance score: 0.13*

**Content:**
> so I'm now running this and it looks like we just received a bunch of very spooky data I don't like the spooky data no spooky data for us um sometimes spooky data like this H this seems kind of weird to me actually just give me one second to make sure that's right we are receiving a data parameter back which is nice
*Importance score: 0.14*

**Content:**
> no it looks like we um we got the data from from Amazon which is pretty cool if you feed that into the markdown converter like we had before it's going to feed in the HTML here pump it into a data key we've now converted this into uh this is very long let's go tabular
*Importance score: 0.22*

**Content:**
> we've now converted this into markdown which is cool and this is pretty long right obviously has all of the images and has all of the information on the site which is cool
*Importance score: 0.22*

**Content:**
> and then we're just going to feed in the code here and then because I didn't feed in this we should now run this we're going to grab data from the site
*Importance score: 0.29*

**Content:**
> and I mean you know we kind of all know what Amazon is and what it does right
*Importance score: 0.14*

**Content:**
> obviously it's just shortening and truncating it for us
*Importance score: 0.10*

**Content:**
> right um sorry just jumping around the place here you can send 72,000 requests basically an hour which is crazy um and you can do so as quickly and as easily as just like adding an API call like
*Importance score: 0.24*

**Content:**
> so if you made it to this part of the uh tutorial and you have yet to sign up to one of these Services give octoparse um give octoparse your thoughts let's double check that I haven't actually created an account using this
*Importance score: 0.21*

**Content:**
> um I don't know if I have enough credits to actually do anything
*Importance score: 0.14*

**Content:**
> but if I'm not then I'll start that trial in a second what you're going to have to do in order to make this work is you're going to want to have to download you're going to want to download the octoparse desktop app
*Importance score: 0.14*

**Content:**
> um if you are using something that is not Mac OS you will not have this strange drag and drop feature here once that is done you will have octo parse accessible just open that up
*Importance score: 0.12*

**Content:**
> yes I want to open this thank you and the cool thing about octoparse um kind of relative to what else you know like the other scraping applications I talked about is this is just running in a desktop app um like kind of in in your computer
*Importance score: 0.26*

**Content:**
> so like it's cool because it's just easy to get up and running with um
*Importance score: 0.08*

**Content:**
> and it's also local as opposed to a lot of these other ones which are not so I'm going to Auto log in on my desktop app remember my password beautiful the simplest and easiest way to scrape a s a service is just to pump in the the URL here then click Start and basically what'll happen is um it'll actually launch like an instance of your browser here with this little tool that allow you similarly the web scraping Chrome extension select the elements on the page you want scraped so I don't know maybe I want these logos scraped the second that I tapped one you'll see it automatically found six similar elements so now I'm actually like scraping all of this stuff
*Importance score: 0.25*

**Content:**
> and then um you can also do things like click elements and so on and so forth extract the text Data here
*Importance score: 0.21*

**Content:**
> so as you see I'm now mapping each of these very similarly to how I was doing before between the first field which is the title of the product and then the second field which is like the field to uh so that's pretty sweet we could do the same thing with a number of things you could extract like the headings and then the values and so on and so on and so forth but I'll kind of leave it there um so once you're done selecting all the elements that you want all you do is you click run and you have a choice between running it on your device versus running it on the cloud so um on the cloud is API supported that's how you're going to get stuff in NM
*Importance score: 0.16*

**Content:**
> but I just want you guys to know that you can also just run it here you could run it here load up the URL scrape all the things that you want on the specific page you're feeding in
*Importance score: 0.28*

**Content:**
> and then you can be done with it
*Importance score: 0.17*

**Content:**
> so I just selected run in the cloud it's now going to open up said Cloud instances as we could see we have this little field where it's running and extracting the data we're now done so I can export this data locally
*Importance score: 0.13*

**Content:**
> um but I could also do a lot of other stuff which we'll show you in a second
*Importance score: 0.17*

**Content:**
> so um you can dump this automatically to Google Sheets you could do zapier to connect to Google Sheets do like some sort of web Hook connection export to cloud storage uh similar stuff to the the web scraping Chrome extension um but for now let's just export this as Json give ourselves a little ad Json file here thank you
*Importance score: 0.19*

**Content:**
> yeah now we have it locally now in order to connect with the octop par CPI what you're going to have to do is first you get up to request an access token the way that you do this is you send a post request to this URL here and the way that you format it is you need to send your username your password and then have the grantor type as password okay now password obviously just put in whatever your password is don't store it in PL text like I'm doing um with my hypothetical password put it somewhere else and then grab that data and then use it um but the the output of this is we have this big long access token variable which is great after that if I just go back to their API here um once we're here we can actually extract the data that we need so basically the thing that you're going to want is you're going to want um get data by Offset you can also use get non-exported data which is interesting so I think this just like dumps all of the data as not exported um and then sends that over to you
*Importance score: 0.22*

**Content:**
> octop course.com SL all and then I just send a header with the URL parameter this is a get request uh we're going to send a header with the token so authorization Bearer and then feed in the access token here just make sure that this is just one space
*Importance score: 0.19*

**Content:**
> no it's two if I feed this in um it's saying that it's a bad request let me just triple check why I think we need three Fields
*Importance score: 0.18*

**Content:**
> right obviously we need to feed in the task ID so you need task ID offset or size
*Importance score: 0.10*

**Content:**
> so um we'll feed this in as query parameters here so send query parameters the first value was task ID second one was offset and uh offset is no Capital the third was size offset's going to be zero size going to be I don't know let's just do 1,000 and what we need now is we need the task ID of the specific run that we just finished oh in order to get the task list you head over to task list top right hand corner here task ID API
*Importance score: 0.09*

**Content:**
> so we now have access to this so if we go back to our NN instance we could feed that in here by test the step you'll see that we now have all the data that we just asked for earlier so a variety of ways to do this um in practice like octop par allows you to schedule runs you could schedule them um using their you know whatever it is uh uh like cloud service you could use it to scrape I don't know Twitter
*Importance score: 0.24*

**Content:**
> uh they have a variety of like other scrapers um that you can check out just heading over to this new here uh if we just go sorry go down to templates um there's a variety of other ways to scrape Google job scraper glass door scraper super Pages scraper you could schedule these right
*Importance score: 0.23*

**Content:**
> and then what you can do in na is you can just query it once a day grab all the data like I showed you how to do a moment ago dump that into some sheet octoparse is pretty cool
*Importance score: 0.17*

**Content:**
> but I I like the idea that you can also just scrape locally which is pretty sweet and the last of our nine best ways to scrape websites in nadn is browserless now browserless runs a headless Chrome instance in the cloud this stuff is great for dynamic or heavy JavaScript websites if you've never used browser list before the cool part about browser list is allows you to actually bypass captas which is a big issue that a lot of people have um so I'm going to click try it for free I'm going to enter my email address over here verify I need to submit a code
*Importance score: 0.25*

**Content:**
> so let's head back over here thank you thank you thank you thank you we have a ton of free trial signups obviously I don't have a promo code or anything don't have a company name
*Importance score: 0.19*

**Content:**
> I'm just going to enter a password I'm using this to get past uh to avoid setting up a puppeteer and playright server sure I'm going to click complete we're now going to have a th credits inside of browser list which is pretty sweet um and we'll get a we'll get a full plan eventually we now have an API token
*Importance score: 0.25*

**Content:**
> so I can figure out how all of the stuff works here I'm just going to dive right into the API I can figure out how all of the API stuff works using their API docs which are fantastic by the way
*Importance score: 0.23*

**Content:**
> um and we don't want to do any of this stuff we just want to do HTTP apis brow list API index
*Importance score: 0.25*

**Content:**
> so here's where we're at um if you want to send and receive a request what you need to do is uh you send a request to one of these endpoints content unblock download function PDF screenshot scrape or performance what we want for the purpose of this is just uh let's do content
*Importance score: 0.23*

**Content:**
> a I'm going to run test step we are now quering the pi and in seconds we have access to the data same thing that we had before but now we're using a pass through and browser list is a great pass through um because you know uh they they allow you to scrape things that go far beyond the usual static site thing so like honestly
*Importance score: 0.27*

**Content:**
> and I'm just leaving this as a secret and sort of a little I guess Easter egg for people that have made it this far in the video like my go-to when scraping websites is as I mentioned do that HTTP request trans forg that works then do something like fir C.D
*Importance score: 0.27*

**Content:**
> but if that doesn't work I I do something like browserless that has all of this stuff built in um and I especially use browser list anytime that there's some sort of you know application where I'm just going to save this
*Importance score: 0.17*

**Content:**
> so I can make all my HTP requests really easy um especially when you know there's issues with captas and and accessing resources and stuff check this out not only can you do um the actual scrape you can do a screenshot of the page as well and because I've entered my token up here the requests that I'm going to setting up are as simple as importing the curl then clicking test step so straightforward we now have a file which is the screenshot now I used example domain there let's go left click.
*Importance score: 0.23*

**Content:**
> run this test now you can see we've actually like received a screenshot of the of the website view very sexy and my website's pretty long so keep in mind um and
*Importance score: 0.21*

**Content:**
> yeah you know obviously a lot you could do with that you can download the site you can turn the site into a PDF
*Importance score: 0.21*

**Content:**
> I don't think I've actually used this one before but for the purposes of this demonstration why don't we give it a try we'll go over here import the curl paste it in voila the website
*Importance score: 0.22*

**Content:**
> I'm going to do is left click.
*Importance score: 0.18*

**Content:**
> aai going to test this step so now there servers doing a couple things like I'm scraping the site then converting it all into PDF format um probably screenshotting a bunch of stuff too if I view this now we now have my my file looks like it didn't capture all of the color aspects um that might just be difficult or whatever
*Importance score: 0.21*

**Content:**
> I hope you guys appreciated the nine best ways to scrape websites in nadn as you guys could see it's a combination of on platform scraping using the HTTP request module a lot of like API documentation stuff like that if you want to get good at this I'm releasing a master class on API stuff um uh as part of my next na tutorial video uh
*Importance score: 0.25*

**Content:**
> and then you know navigating this and then and then taking the data from these services and using them to do something that you want to do like artificial intelligence to give you a summary of the site or generate ice breakers for you or do something else um whether you're using a local application like octop parse or maybe the web scraping CH uh Chrome extension or using something like firra browserless appify rapid API and so on and so forth um you now have everything that you need in order to scrape static sites Dynamic sites super Js heavy websites and even social media websites like Tik Tok Twitter and Instagram thanks so much for making it to this point in the video if you have any suggestions for future content drop them down below more than happy to take your idea and run with it assuming it's something that I haven't done before and then if you guys could do me a really big solid like subscribe do all that fun YouTube stuff
*Importance score: 0.24*

---

### Comparisons (1 items)

**Content:**
> so maybe you wanted to find a keyword and maybe again it's Nicks or location you want let's do United States that'll probably be better language um I'm just not going to select an language

---

## Role-Based Content

### User Instructions (74 items)

**Content:**
> so let me give you guys a website that I'm going to be scraping here this is my own site it's called left click I'm about to do a redesign
*Matched patterns: click*

**Content:**
> so if I were to zoom in over here you see where it says I don't know let's let's go to my website let's just find a little bit of little bit of texture build hands off growth systems
*Matched patterns: go to*

**Content:**
> so I'll go down to open Ai
*Matched patterns: open*

**Content:**
> and then what I'm going to do is I'll do the message a model just have to connect my credential here I'm assuming that you've already connected a credential if not you're going to have to go to opena website when you do the connection um and grab your API key and paste it in there's some instructions that allow you to do so right over here uh what I'm going to do is I'm going to grab the G PT 40 Mini model that's just the uh I want to say most cost effective one as of the time of this recording
*Matched patterns: open, go to*

**Content:**
> and then I'm just going to show an example of un array of we'll go absolute URLs this is very important that they're absolute URLs any thing that we're going to build after this is going to be making use of the absolute URLs not the relative URLs if you're unfamiliar with what that means if we Zoom way in here you see how there's this B uh SL left click log.png this is what's called a relative URL if you were to copy this and paste this into here this wouldn't actually do anything for us
*Matched patterns: click*

**Content:**
> right uh what we what we want is we want this instead we want left click aka the root of the domain and then um left click _ logogram and that's how we get to the actual file asset
*Matched patterns: click*

**Content:**
> so this is our example I'm going to say your website URL is left click URL for the relative to Absolute conversions is left click.
*Matched patterns: click*

**Content:**
> and then the final thing is I'm going to add one more user prompt I'm just going to draw drag all of that markdown data in here then I'm going to click output content as Json I'm going to test the step I'm going to take a sip of my coffee while this puppy processes and we now have our output on the right hand side if we go to schema view what you can see is we've now generated basically an array of links on the rightand side which contains every link on this website very cool looks like the vast majority of these are type form links for some reason don't really know what's about that
*Matched patterns: click, go to, type*

**Content:**
> and then now you know we have basically the same thing you also get it in Json which is pretty cool um and you know you can slot this into any workflow this is basically like the simple and easy way of getting started um what we're going to be showing you today is the extract endpoint which allows you to extract data just using a natural language prompt which is pretty cool and from here we're going to be able to take any URL and just turn it into structure data but we're not actually going to have to know how to parse we're not going to have to know any code we're not going to have to know any of that stuff so let me actually run through the signup process with you guys go to fire.
*Matched patterns: go to*

**Content:**
> Dev here just going to open this up in an incognito to show you guys what this looks like all you do is you just go sign up I'm going to add a password we're then going to have to validate this one
*Matched patterns: open*

**Content:**
> so um let's go from the homepage at left click.
*Matched patterns: click*

**Content:**
> but all I need to do in order to make this work is I click generate parameters it's going to basically now generate me a big object with a bunch of things so copy summary Icebreaker company name
*Matched patterns: click*

**Content:**
> so if we go to curl as you can see what we need to do is we need to format a request that looks something like this
*Matched patterns: go to*

**Content:**
> and then what I need to do is just open up an HTTP request module and then click import curl just paste all the stuff inside now this is an example request
*Matched patterns: click, open*

**Content:**
> so what I'm going to do is I'm going to delete most of these I'll go back to my left click.
*Matched patterns: click*

**Content:**
> so I'm going to go Copy Type string then summary
*Matched patterns: type*

**Content:**
> so we're going to go summary type string then Icebreaker it's going to be Icebreaker type string then guess what we have last but not least company name which is going to be type string we're also going to want to make these fields required like uh you know you can set it up so they're not actually required when you do a request
*Matched patterns: type*

**Content:**
> so now we have the API request formatted correctly um all we need to do at this point is just click test step it looks like we're getting a Json breaking um error
*Matched patterns: click*

**Content:**
> and now we have all of the data available to us automate your business in the copy field summary field left clicks an ad performance optimization agency Icebreaker
*Matched patterns: click*

**Content:**
> hi Nick I came across left click I'm impressed by you help B2B Founders scale their business automation keep in mind I never gave it my name it went it found my name on the website uh and then company name left click so quick and easy way uh you're going to have access to this template obviously without my API key in it um and feel free to you know use fir craw go nuts check out their documentation build out as complex a scraping flow as need be the third way to scrape websites in nadn is using rapid API for those of you that are unfamiliar rapid API is basically a giant Marketplace of third party scrapers similar to appify which I'll cover in a moment but instead of looking for um you know building out your own scraper for a resource let's say you're wanting to scrape Instagram or something that's not a simple static site what you can do is you could just get a scraper that somebody's already developed that does specifically that using proxies and all that tough stuff that I tend to abstract away um and then you just request uh to Rapid API which automatically handles the API request to the other thing that they want and then they format it and send it all back to and then you know you have beautiful um data that you could use for basically anything so this is what rapid API looks like it's basically a big Marketplace I just pumped in a search for website over here and we see 2,97 results to give you guys some context you can do everything from you know scraping social data like emails phone numbers and stuff like that from a website you could ping the ah refs SEO API you could find uh I don't know like unofficial medium data that they don't necessarily allow people to do so this is just a quick and easy way to I guess do a first pass after you've run through fir crawl maybe that doesn't work after you've run through HTTP request that doesn't work um just do a first pass look for something that scrapes the exact resource you're looking for and then take it from there so obviously for the purpose of this I'm just going to use the website to scraper API which is sort of just like a wrapper around what we're doing right now in nadn um but this website scraper API allows you to scrape some more Dynamic data um now I'm not signed up to this
*Matched patterns: click*

**Content:**
> so I'm going to type website in here
*Matched patterns: type*

**Content:**
> uh I'm just going to go to the um basic plan
*Matched patterns: go to*

**Content:**
> and why don't we actually run through what this would look like if we were to run a curl request you see how it's automatically just formatting it as curl well that just means we just jump back here connect this to my HTTP request module click import curl paste it in like this import
*Matched patterns: click*

**Content:**
> and it's actually going to go through and it's going to automatically map all these fields for me right query parameter URL left click.
*Matched patterns: click*

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites
*Matched patterns: select*

**Content:**
> um so we're going to run through what it looks like so first thing I'm going to want to do is I'm going to want to let's just go Cloud login or sorry um start free 7-Day trial as you can see you know there's a free browser extension here if you wanted to do uh I don't know like highs scale stuff you'd choose probably their project um endpoint where we Sorry project plan where we have 5,000 URL credits we can run a bunch of tasks in parallel we could scrape Dynamic sites JavaScript sites we have a bunch of different export options then we can also just connect it directly to all of these um what I'm going to do just because I want this to kind of work as a first go is I'm just going to sign up to a free Tri here beautiful just created my account just go left click give it a phone number we'll go left click.
*Matched patterns: click, choose*

**Content:**
> so now we have it right over here I'm just going to pin it to my browser to make my life easier go to left click.
*Matched patterns: click, go to*

**Content:**
> a open up this puppy now there's a bunch of like tutorials and how to use this stuff um that's not that big of a deal but basically the thing you need is you need to hold command plus option plus I to open up your developer tools and you'll just find it on the in my case the far right
*Matched patterns: open*

**Content:**
> I that'll open up Dev tools you see all the way on the right hand side here I have a couple other things like make and and cookie editor but all the way on the right hand side here we have this web scraper thing
*Matched patterns: open*

**Content:**
> um so we got what you're going to want to do first you're going to want to create a site map for the resource that you're going to want to scrape I'm just going to call it left click
*Matched patterns: click*

**Content:**
> and I just want to scrape left click.
*Matched patterns: click*

**Content:**
> once we have our sitemap if I just give a quick little click I can then add a new selector and the really cool thing about this web scraper is um if I just zoom out a little bit here uh what you can do is you can you can select the elements on the website that you want scraped so for instance it's a very quick and easy way to do this if you think about it is like just to show you guys an example structure data is uh sort of like an e-commerce application let's say you have like the title of a product and you have like I don't know the the description of a product so on my website really quick and easy way to do this is let's just call this products and it's a type text what I'm going to do is I'm going to click select then I'll just click on this I'll click on this as well and as you see it'll automatically find all of the headings that I'm looking for so that's products we are going to then click data I'm going to click done selecting data preview as you can see it only selected one of them the very first
*Matched patterns: click, select, type*

**Content:**
> so now we have a basically like a list of headings um from here I'm going to save this selector I'm add a new one let's go product descriptions and then going to select this this it'll select all of them
*Matched patterns: select, save*

**Content:**
> oh sorry I didn't actually select the um didn't actually finish it now we're getting product descriptions that's pretty cool um this is me doing this sort of like one at a time you can also um group
*Matched patterns: select*

**Content:**
> The selectors there you go it's actually um offered to group it for me so we can uh group this into one object with products and then product descriptions
*Matched patterns: select*

**Content:**
> it now we have wrapper for products and products descriptions then we have products and product descriptions buried underneath we could go as far as we want with this but basically what I'm what I'm trying to show you guys is very simple and easy just drag your mouse over the specific thing you want if you select more than one it'll automatically find all of them on the website which is really cool
*Matched patterns: select*

**Content:**
> I'll just call this left click scraper and I'm going to import this to my cloud scraper uh I think I'm running into
*Matched patterns: click*

**Content:**
> I don't think we can do a space there my bad just call it left click and now what we can do is we can actually just like run a server instance that goes out and then scrapes this for us
*Matched patterns: click*

**Content:**
> so I'm going to click scrape it looks like I need to verify my email so just make sure you do that before you try and get ahead of yourself like I was okay looks like we just verified the email let's head back over here refresh then scrape
*Matched patterns: click*

**Content:**
> and then we can set like a web hook URL where we we receive the request so um let me check we need a scraping for testing you need a scraping job that has already been finished I think our scraping job has already been finished I'm just going to go htps uh back to my n8n flow I'm actually going to build an n8n web hook give that a click I'm not going to have any authentication let me just turn all this off basically what we want is we we want to use this as our test event we're going to go back to the API paste this in save
*Matched patterns: click, save*

**Content:**
> so just copy that over uh great and now if I run this I'm actually selecting that specific job then from here we have all the data that we just scraped as you can see there's like a uh the way that CSV Works actually let me just copy this over here I just wanted to give this to you guys as an example of a different data type
*Matched patterns: select, type*

**Content:**
> so just as we had earlier we have Instagram scrapers we have Tik Tok scrapers we have email scrapers we have map scrapers Google Maps we could do I don't know Twitter scrapers uh medium scrapers right basically any any service out there that has this Dynamic aspect to it that's not a simple HTTP request you can make you could scrape it using ampify and then obviously you you have things too like just like basic website crawlers you can generate screenshots of sites I mean there's just there's so many things let me walk you guys through what it looks like now in my case I'm not actually going to sign up to appify because I have like 400 accounts but trust me when I say it is a very easy and simple process you go to app ay.com you go get started you put in your email and your password they'll give you $5 in free platform credit you don't need any credit card and you can just get up and running and start using this for yourself super easily then the second that you have all that you'll be Creed with this screen it is a console screen don't be concerned when you see this um you know this is super simple and and easy and and not a big deal this is one of my free accounts
*Matched patterns: go to*

**Content:**
> um so I just wanted to show you guys what you can do with a free account uh but from here what you do is you go to the store and as you can see I'm just dark mode all this is the same thing we were just looking at before
*Matched patterns: go to*

**Content:**
> so what I'm going to want to do is for the purposes of this I'm now going to do something different from what I was doing before like which was just left click over and over and
*Matched patterns: click*

**Content:**
> and then I'm just going to grab like I don't know the last 10 posts okay save and start this is now going to run an actor actor is just their term for scraper which will go out it'll extract data from my Nick surve Instagram and as you can see will get a ton of fields caption owner full name owner Instagram URL comments count first comment likes count timestamp query tag we get everything from these guys which is really cool this might take you know 30 40 50 seconds we are spinning up a server in real time every time you do this as you see in bottom left hand corner there's a little memory tab which shows that we are legitimately running a server with one gigabyte of memory right now so generally my recommendation when you use appify is not to use it for oneoff requests like this feed in 5 to 10 15 20 Instagram Pages
*Matched patterns: save*

**Content:**
> but I just wanted to like allow you to see how to get data in naden really quickly now if we go to the schem of view we can see we legitimately we we already have all of the data that we we had from appify a second ago okay super easy and quick and simple to get up and running um we have the input URL field the ID field the type the short code caption now this is Instagram um every looks like we have some comments I don't have any style how do I create my man you just got to fake it till you make it
*Matched patterns: go to, type, input*

**Content:**
> so if we just go to that next HTTP request node what I can do is I can feed that in as a variable right here let going to a default data set ID drag that in between these two little lines and now we can test that step with actual live data now we have everything that we need so I don't know maybe now you want to feed this into Ai
*Matched patterns: go to*

**Content:**
> so I'm just going to click try for free over here in the top right hand corner show you guys what that looks like and as you see here um I signed in to data for SEO to my own account looks like I have 38 million bajillion dollars
*Matched patterns: click*

**Content:**
> and then I'll just use that account that is 38 million bajillion dollars we'll click try for free we'll go Nikki Wiki uh let's use a different email I need a business email
*Matched patterns: click*

**Content:**
> and yeah let's actually run through this the first thing that I recommend you do is go over to playground on the Le hand side there's all of their different API endpoints that you can call um what I'm going to do is I'll just go to serp for now just to show you that you could scrape Google with this pretty easily
*Matched patterns: go to*

**Content:**
> so maybe you wanted to find a keyword and maybe again it's Nicks or location you want let's do United States that'll probably be better language um I'm just not going to select an language
*Matched patterns: select*

**Content:**
> and it's basically going to um parse out all these fields that I'm interested in with the URL which I'll go htps left click.
*Matched patterns: click*

**Content:**
> so maybe this is me searching Nix or have Reddit uh Nick left click.
*Matched patterns: click*

**Content:**
> we should be good to log in so that's what's happening we need to select the animal again just doesn't it doesn't believe really just doesn't believe okay
*Matched patterns: select*

**Content:**
> so we're going to go crawl base API we have a th000 free crawls remaining very first thing we're going to want to do is just click start crawling now just to get up and running with the API um and as you see here the these guys have probably one of the simplest apis possible all API URLs start with the folling base part click
*Matched patterns: click*

**Content:**
> so well I'm going to import it as you can see here we have a token field then we just have the URL field of the place we want to crawl so I'm going to do left click.
*Matched patterns: click*

**Content:**
> okay anyway they give you two types of tokens here um this is why I'm talking about it to begin with I'm also because I just used it before for a couple of applications
*Matched patterns: type*

**Content:**
> and then we can feed it into open AI like I did before where I message a model
*Matched patterns: open*

**Content:**
> um if you are using something that is not Mac OS you will not have this strange drag and drop feature here once that is done you will have octo parse accessible just open that up
*Matched patterns: open*

**Content:**
> yes I want to open this thank you and the cool thing about octoparse um kind of relative to what else you know like the other scraping applications I talked about is this is just running in a desktop app um like kind of in in your computer
*Matched patterns: open*

**Content:**
> and it's also local as opposed to a lot of these other ones which are not so I'm going to Auto log in on my desktop app remember my password beautiful the simplest and easiest way to scrape a s a service is just to pump in the the URL here then click Start and basically what'll happen is um it'll actually launch like an instance of your browser here with this little tool that allow you similarly the web scraping Chrome extension select the elements on the page you want scraped so I don't know maybe I want these logos scraped the second that I tapped one you'll see it automatically found six similar elements so now I'm actually like scraping all of this stuff
*Matched patterns: click, select*

**Content:**
> okay now we have access to this sort of drag and drop or um selector thing similar to what we had before if you click on one of these you'll see it allow you to select all similar Elements which is pretty sweet
*Matched patterns: click, select*

**Content:**
> and then um you can also do things like click elements and so on and so forth extract the text Data here
*Matched patterns: click*

**Content:**
> so as you see I'm now mapping each of these very similarly to how I was doing before between the first field which is the title of the product and then the second field which is like the field to uh so that's pretty sweet we could do the same thing with a number of things you could extract like the headings and then the values and so on and so on and so forth but I'll kind of leave it there um so once you're done selecting all the elements that you want all you do is you click run and you have a choice between running it on your device versus running it on the cloud so um on the cloud is API supported that's how you're going to get stuff in NM
*Matched patterns: click, select*

**Content:**
> so I just selected run in the cloud it's now going to open up said Cloud instances as we could see we have this little field where it's running and extracting the data we're now done so I can export this data locally
*Matched patterns: select, open*

**Content:**
> yeah now we have it locally now in order to connect with the octop par CPI what you're going to have to do is first you get up to request an access token the way that you do this is you send a post request to this URL here and the way that you format it is you need to send your username your password and then have the grantor type as password okay now password obviously just put in whatever your password is don't store it in PL text like I'm doing um with my hypothetical password put it somewhere else and then grab that data and then use it um but the the output of this is we have this big long access token variable which is great after that if I just go back to their API here um once we're here we can actually extract the data that we need so basically the thing that you're going to want is you're going to want um get data by Offset you can also use get non-exported data which is interesting so I think this just like dumps all of the data as not exported um and then sends that over to you
*Matched patterns: type*

**Content:**
> but anyway you could also get the data by offset so if I go a get request to open api.
*Matched patterns: open*

**Content:**
> it's like more of like an industrial Enterprise level application um to be honest so there might be some gotas if you're not super familiar with working with like desktop apps and stuff
*Matched patterns: enter*

**Content:**
> but I I like the idea that you can also just scrape locally which is pretty sweet and the last of our nine best ways to scrape websites in nadn is browserless now browserless runs a headless Chrome instance in the cloud this stuff is great for dynamic or heavy JavaScript websites if you've never used browser list before the cool part about browser list is allows you to actually bypass captas which is a big issue that a lot of people have um so I'm going to click try it for free I'm going to enter my email address over here verify I need to submit a code
*Matched patterns: click, enter, submit*

**Content:**
> I'm just going to enter a password I'm using this to get past uh to avoid setting up a puppeteer and playright server sure I'm going to click complete we're now going to have a th credits inside of browser list which is pretty sweet um and we'll get a we'll get a full plan eventually we now have an API token
*Matched patterns: click, enter*

**Content:**
> and where it says your API token here I'm going to feed that in what I want as a website is just left click.
*Matched patterns: click*

**Content:**
> but if that doesn't work I I do something like browserless that has all of this stuff built in um and I especially use browser list anytime that there's some sort of you know application where I'm just going to save this
*Matched patterns: save*

**Content:**
> so I can make all my HTP requests really easy um especially when you know there's issues with captas and and accessing resources and stuff check this out not only can you do um the actual scrape you can do a screenshot of the page as well and because I've entered my token up here the requests that I'm going to setting up are as simple as importing the curl then clicking test step so straightforward we now have a file which is the screenshot now I used example domain there let's go left click.
*Matched patterns: click, enter*

**Content:**
> I'm going to do is left click.
*Matched patterns: click*

---

### Developer Instructions (127 items)

**Content:**
> I scaled my automation agency to 72k a month using no code tools like make and nadn and scraping was a big part of that
*Matched patterns: code, api*

**Content:**
> all right I'm going to jump into NN in a minute and actually build these alongside you and one other thing I'm going to do is I'm actually going to sign up to all the services in front of you walk you through the Authentication and the onboarding flows and get your API keys and stuff like that but just before I do want to explain very quickly the difference between a static site and then a dynamic site because if you don't know this um scraping just gets a lot harder and so we're just going to cover this in like 30 seconds and we can move on so basically um if this is you
*Matched patterns: api*

**Content:**
> so um there's actually that intermediate step okay where basically you are pinging some sort of uh you know domain name or whatever then that domain name shoots some code over forces a server to generate all of the contents on that domain and then you get it this is obviously kind of a two-step process and then this is a three-step process
*Matched patterns: code*

**Content:**
> so if you just understand that um you know when you scrape a dynamic resource what you're really doing is you're sending a request to a page which sends a request back to another server which then fills your thing this element eliminates 99% of the confusion because most of the time like scraping issues are hey
*Matched patterns: api*

**Content:**
> so hopefully we at least understand that there's that difference between static and dynamic sites here um I'm not going to go into it more than that we're actually just going to dive in with both feet start doing a little bit of scraping and then we'll kind of see where we land I find the best way to do this stuff is just by example
*Matched patterns: api*

**Content:**
> and and you know being practical about it so the first major way to scrape websites in NN is using direct h HTTP requests this is also what I like to think of as the Magic in scraping itself what we're going to do is we're going to use a node called the HTTP request node to send a get request to the website we want this is going to work with static websites and non JavaScript resources
*Matched patterns: api*

**Content:**
> so let me give you guys a website that I'm going to be scraping here this is my own site it's called left click I'm about to do a redesign
*Matched patterns: api*

**Content:**
> I I did it in code and basically all this is is just a document somewhere on my or on on a server some more so what I'm going to want to do is
*Matched patterns: code*

**Content:**
> so uh we're just going to go HTTP request HTTP request node looks like this we have a method field a URL field authentication field query parameters headers body and then some options down here as well all
*Matched patterns: method, parameter*

**Content:**
> okay then I'm just going to test the step it's that easy now the response from this on the right hand side see all this code over here this is what's called HTML if you're unfamiliar and
*Matched patterns: code*

**Content:**
> HTML is basically just the like it's it's the code behind the site
*Matched patterns: code*

**Content:**
> right so all that this HTML is is this is the code that is sent to my browser which is Google Chrome in this case then my browser takes the code and it just renders it into this beautiful looking thing well beautiful is a subjective State I would say but this uh wonderful looking thing in front of us which is this website with like sizing and the tabs and the divs and all that fun stuff
*Matched patterns: code*

**Content:**
> so basically what I'm trying to say is everything over here on the right hand side this is the entire site we can do anything we want with this information um and we can carry this information forward to to do any one of our any one of many flows so in my case right looking at a bunch of code isn't really very pretty so one big thing that you'll find in the vast majority of modern um scraping applications is you'll find that they'll take that HTML which we saw earlier and they'll convert it to something called markdown
*Matched patterns: code, api*

**Content:**
> and then what I'm going to do is I'll do the message a model just have to connect my credential here I'm assuming that you've already connected a credential if not you're going to have to go to opena website when you do the connection um and grab your API key and paste it in there's some instructions that allow you to do so right over here uh what I'm going to do is I'm going to grab the G PT 40 Mini model that's just the uh I want to say most cost effective one as of the time of this recording
*Matched patterns: api*

**Content:**
> and then what I'm going to do is I'm going to add three prompt I'm going to add a system prompt first I'll say you are a helpful intelligent web scraping assistant
*Matched patterns: api*

**Content:**
> and then I'm going to give it an example of what I want in what's called Json JavaScript object notation format so the very first thing I'm going to do is I'm going to have it just pull out all the links on the website because I find that that's a very common scraping application so I go links
*Matched patterns: api*

**Content:**
> and then I'm just going to show an example of un array of we'll go absolute URLs this is very important that they're absolute URLs any thing that we're going to build after this is going to be making use of the absolute URLs not the relative URLs if you're unfamiliar with what that means if we Zoom way in here you see how there's this B uh SL left click log.png this is what's called a relative URL if you were to copy this and paste this into here this wouldn't actually do anything for us
*Matched patterns: import*

**Content:**
> right then we have a oneline summary of the site so this is a very simple example of scraping we're scraping a static resource obviously but when I build scrapers for clients or for my own business this is always my first pass I will always just make a basic HTTP request to the resource that I'm looking at because if I can make that http request work whether it's a get request or whatever the the the rest of my life building scraper building the scraper is so easy I just take the data I process it usually using AI or some very cheap
*Matched patterns: api*

**Content:**
> and then now you know we have basically the same thing you also get it in Json which is pretty cool um and you know you can slot this into any workflow this is basically like the simple and easy way of getting started um what we're going to be showing you today is the extract endpoint which allows you to extract data just using a natural language prompt which is pretty cool and from here we're going to be able to take any URL and just turn it into structure data but we're not actually going to have to know how to parse we're not going to have to know any code we're not going to have to know any of that stuff so let me actually run through the signup process with you guys go to fire.
*Matched patterns: code*

**Content:**
> but all I need to do in order to make this work is I click generate parameters it's going to basically now generate me a big object with a bunch of things so copy summary Icebreaker company name
*Matched patterns: parameter*

**Content:**
> okay this is the URL it just parsed as well let's give it a run what it's doing now is it's scraping the pages using their high throughput server I just love this thing like I'm not sponsored by fire crawl or anything like that
*Matched patterns: api*

**Content:**
> uh well it's pretty simple as you see there's an integrate Now button you can either get code or you can use it in zap here basically what we're going to want to do is we're going to want to run a request to um their endpoint
*Matched patterns: code*

**Content:**
> and then what I need to do is just open up an HTTP request module and then click import curl just paste all the stuff inside now this is an example request
*Matched patterns: import*

**Content:**
> so we're sending a bunch of headers this is the endpoint that we're calling api. fire.
*Matched patterns: api*

**Content:**
> so kind of a kind of a middleman and then all I'm going to do so if I go back to my example we have an API key here which we're going to need so I'm going to go here and then paste in an API key so that's how that work works right authorization is going to be the name value is going to be bear with a capital b space
*Matched patterns: api*

**Content:**
> and then the API key
*Matched patterns: api*

**Content:**
> logically maybe not all the websites we're going to be scraping using this service are going to have the company names visible on the website I don't know
*Matched patterns: api*

**Content:**
> so now we have the API request formatted correctly um all we need to do at this point is just click test step it looks like we're getting a Json breaking um error
*Matched patterns: api*

**Content:**
> right so instead of just having the data available to us right now immediately what we need to do is we need to basically wait a little while wait until it's done and we need to Ping it and the reason why they've given us this ID parameter so that we could do the pinging so the way that you do this is you'd have to send a second HTTP request using this structure so the good news is we could just copy this over
*Matched patterns: parameter*

**Content:**
> but I guess I'm just going to create it over here I'm going to import the curl to this request just like that then keep in mind that we just need to add our API key again because the previous node had it
*Matched patterns: api, import*

**Content:**
> hi Nick I came across left click I'm impressed by you help B2B Founders scale their business automation keep in mind I never gave it my name it went it found my name on the website uh and then company name left click so quick and easy way uh you're going to have access to this template obviously without my API key in it um and feel free to you know use fir craw go nuts check out their documentation build out as complex a scraping flow as need be the third way to scrape websites in nadn is using rapid API for those of you that are unfamiliar rapid API is basically a giant Marketplace of third party scrapers similar to appify which I'll cover in a moment but instead of looking for um you know building out your own scraper for a resource let's say you're wanting to scrape Instagram or something that's not a simple static site what you can do is you could just get a scraper that somebody's already developed that does specifically that using proxies and all that tough stuff that I tend to abstract away um and then you just request uh to Rapid API which automatically handles the API request to the other thing that they want and then they format it and send it all back to and then you know you have beautiful um data that you could use for basically anything so this is what rapid API looks like it's basically a big Marketplace I just pumped in a search for website over here and we see 2,97 results to give you guys some context you can do everything from you know scraping social data like emails phone numbers and stuff like that from a website you could ping the ah refs SEO API you could find uh I don't know like unofficial medium data that they don't necessarily allow people to do so this is just a quick and easy way to I guess do a first pass after you've run through fir crawl maybe that doesn't work after you've run through HTTP request that doesn't work um just do a first pass look for something that scrapes the exact resource you're looking for and then take it from there so obviously for the purpose of this I'm just going to use the website to scraper API which is sort of just like a wrapper around what we're doing right now in nadn um but this website scraper API allows you to scrape some more Dynamic data um now I'm not signed up to this
*Matched patterns: api*

**Content:**
> but yeah we're going to we're going to run through an API request to Rapid API which is going to make this a lot easier just going to put in all of my information here
*Matched patterns: api*

**Content:**
> and then I'm going to do the classic email verification
*Matched patterns: class*

**Content:**
> thank you rise I use a time management app called rise and every time I go on my Gmail I set my Gmail up as like a definitely do not uh do during your workday let's just call it personal projects they don't ask me all these questions my goal today is to browse available apis awesome
*Matched patterns: api*

**Content:**
> uh I'm going to look for wherever it was earlier website scraper API and now check this out what we have is we have the app which is the name of the specific API that we're requesting we have an x-raid api-key and this is the API key we're going to use to make the request then we have the request URL which is basically what we're pinging and what we can do here is we can feed in the parameters
*Matched patterns: api, parameter*

**Content:**
> and I just ran through the payment let's actually head over here and let's just run a test using my website URL we're going to test this endpoint now and now this actually going to go through Rapid API it's going to spin up the server
*Matched patterns: api*

**Content:**
> and then it's going to send it and what we see here is we have multiple fields that Rapid apis or this particular scraper gives us let me just make this easier for you all to see we have a text content field with all of the content of the website which is cool this is basically what I did earlier um but instead of me having to formulate this request try and parse it and try and use AI tokens what I did is I sent the request to uh rapid API and did it all for me then we also have an HTML content field I think we have one more here scroll all the way down to the bottom as you can see there is a ton of HTML
*Matched patterns: api*

**Content:**
> but um if they find anything that's at their Twitter Instagram whatever then we have the link right over here it looks like they even give you the scraping time and if they scrape emails or phone numbers um they'll be there as well
*Matched patterns: api*

**Content:**
> so I mean rapid AP is obviously fantastic this is a high throughput sort of thing
*Matched patterns: api*

**Content:**
> and why don't we actually run through what this would look like if we were to run a curl request you see how it's automatically just formatting it as curl well that just means we just jump back here connect this to my HTTP request module click import curl paste it in like this import
*Matched patterns: import*

**Content:**
> and it's actually going to go through and it's going to automatically map all these fields for me right query parameter URL left click.
*Matched patterns: parameter*

**Content:**
> beautiful um API key x-raid API host here's the host here's the name of the API key here's everything we need
*Matched patterns: api*

**Content:**
> well I can actually just recreate this request now inside of NN as opposed to being on rapid API and then I have all the data accessible to me here how cool is that so we can do this for any any major website
*Matched patterns: api*

**Content:**
> really um you know there are a lot of specific bespoke scrapers obviously which um I don't know if you wanted to scrape uh let's go back to Discovery if you wanted to scrape like Instagram or something you could scrape um Instagram uh you could do like Facebook scraping you could scrape these large giants that are quite difficult to do
*Matched patterns: api*

**Content:**
> right like if you're scraping uh I don't know 50 every day or 100 every day or something might be a dollar or two a day which is reasonable
*Matched patterns: api*

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites
*Matched patterns: code, install*

**Content:**
> and then you can um export that data as a cloud run to then send back sorry big sneeze to then send back to some API or some service um and then automatically do parsing and stuff like that so very cool I'm going to show you guys what that looks like um this is sort of a more customized way to build the stuff
*Matched patterns: api*

**Content:**
> so now we can import and run our own site map or we can use a premade Community sit map um what I'm going to do is I'm just going to import this we're then going to get the Chrome extension web scraper let me add that extension and it's going to download it do all that fun stuff beautiful
*Matched patterns: import*

**Content:**
> okay great once we have this um what I can do is I can actually go export sitemap so now I have all of the code on the website that actually goes and finds it for me then I can paste this in here
*Matched patterns: code*

**Content:**
> I'll just call this left click scraper and I'm going to import this to my cloud scraper uh I think I'm running into
*Matched patterns: import*

**Content:**
> we've now scheduled a scraping job for this sitemap scheduling you know in their lingo just means that it's now part of their big long queue of thousands of other things that they're probably scraping through their server and that's fine
*Matched patterns: api*

**Content:**
> okay I just gave this a refresh and as we see we have now finished said scraping job we have all of the data available to us using their UI but now that we've gone through this process of you know building out this this thing um how do we actually take that and then use it in our nadn flows so variety of ways um if you wanted to connect this let's say to specific service like Dropbox um Google you know dump anow or something Google Drive I'd recommend just doing it directly through their integration it's just a lot easier to get the data there
*Matched patterns: api*

**Content:**
> and then you can just connect it to n and watch the data as it comes in or something you can also use the web scraper API uh this is pretty neat because you can you know that's what we're going to end up using it was pretty neat because you can uh like schedule jobs you can send jobs you can do basically everything just through the NN interface
*Matched patterns: api*

**Content:**
> and then we can just retrieve the data afterwards which is pretty neat um this is basically what you end up getting you end up with scraping job ID status sitemap all this fun stuff
*Matched patterns: api*

**Content:**
> and then we can set like a web hook URL where we we receive the request so um let me check we need a scraping for testing you need a scraping job that has already been finished I think our scraping job has already been finished I'm just going to go htps uh back to my n8n flow I'm actually going to build an n8n web hook give that a click I'm not going to have any authentication let me just turn all this off basically what we want is we we want to use this as our test event we're going to go back to the API paste this in save
*Matched patterns: api*

**Content:**
> so I'm going to stop listening change your HTTP HTTP method here to post there's basically two ways to call a website and this is one of them I'm going to listen for test events go back here and then retest awesome looks like we've now triggered the beginning of our workflow using this data let's see what sort of information was in it
*Matched patterns: method*

**Content:**
> we have the scraping job ID the status execution mode
*Matched patterns: api*

**Content:**
> and then we can set up a web hook in NN that will catch the notification get the update now we can do is we can ping um we can ping the web scraping API which I'll show you to set up in a second to request the data from that particular scraping run and from here we can take that data do whatever the heck we want with it but obviously let me show you an example of what the the actual data looks like so we just got the data from web hook let's set up an HTTP request to their API now where we basically get the ID of the thing
*Matched patterns: api*

**Content:**
> so got my API token over here I'm going head over to their API documentation first
*Matched patterns: api*

**Content:**
> so I've already gone ahead and I've gotten the method which was a get request so I've added that up here the URL was this over here with the scraping job ID and then your API token there so what I've done is I've grabbed the API token and the scraping job ID
*Matched patterns: api, method*

**Content:**
> I mean I hardcoded it in here just while I was doing the testing let's actually make this Dynamic now drag the scraping job ID right over here voila
*Matched patterns: code, api*

**Content:**
> and then the API token if you guys remember back here on the API page you have your access to API token
*Matched patterns: api*

**Content:**
> I'm imagine scraping this for some lead genen applica sorry some some e-commerce application list of products here product descriptions maybe product prices maybe product whatever the heck you want um
*Matched patterns: api*

**Content:**
> but Cent how appify is is it is a Marketplace very similar to Rapid API um although extraordinarily well Main ained and they also have a ton of guides set up to help you get you know up and running with scraping any sort of application
*Matched patterns: api*

**Content:**
> um so the question is obviously how do you get this in NN well appify has a really easy to use um API which I like doing all you have is if we wanted to get the uh let's see get data set items
*Matched patterns: api*

**Content:**
> okay all I'm going to do is I'm just going to copy this go back here and then connect this to an HTTP request module as you could see we have this big long field here with my API appify API token
*Matched patterns: api*

**Content:**
> but I just wanted to like allow you to see how to get data in naden really quickly now if we go to the schem of view we can see we legitimately we we already have all of the data that we we had from appify a second ago okay super easy and quick and simple to get up and running um we have the input URL field the ID field the type the short code caption now this is Instagram um every looks like we have some comments I don't have any style how do I create my man you just got to fake it till you make it
*Matched patterns: code*

**Content:**
> um obviously I was scraping an Instagram resource but like if you were scraping something else there'd be no change to this at all no change whatsoever now uh basically what we need in order to make this Dynamic basically make us able to run something in appify and then get it in NN so we need to set up an integration so just head over to this tab set up integration and then all you want to do is you just want to do web hook send an HTTP post web Hook when a specific actor event happens the actor event that we're going to want is basically when the run is succeeded the URL we're going to want to send this to if you think about it we just actually make another web hook request here web hook the URL we're going to want to send it to is going to be this test URL over here now I'm just going to delete all the header off stuff here because um it just uh complicates it especially for beginners
*Matched patterns: api*

**Content:**
> so if we just go to that next HTTP request node what I can do is I can feed that in as a variable right here let going to a default data set ID drag that in between these two little lines and now we can test that step with actual live data now we have everything that we need so I don't know maybe now you want to feed this into Ai
*Matched patterns: variable*

**Content:**
> I mean the options are ultimately unlimited that's why I love appify so much the sixth way to scrape websites with NN is data for Co this is another thirdparty service but it's a very high quality one that's specifically geared towards search engine optimization requests you guys haven't seen data for SEO before it's basically this big API stack that allows you to do things like automatically query a service maybe some e-commerce website or some content website and then like extract things in nicely structured formatting um again specifically for SEO purposes tons of apis here as well I mean a lot of these services are now going towards like more Marketplace style stuff
*Matched patterns: api*

**Content:**
> so I need to activate my account doesn't look like it allows you to feed in the code here so I'm just going to feed it in myself
*Matched patterns: code*

**Content:**
> uh it's obviously you're getting a lot of spammers hence this um bicycle stuff I don't know why the code isn't working here let me just copy this link address paste it in here instead there you go
*Matched patterns: code*

**Content:**
> so now you can sign in and once you're in you got also um they're actually really big on on bicycles they're training um a model to convert all ads on planet Earth into bicycles they'll actually give you a dollar worth of API access uh credits which is pretty cool um I'm not going to do that I'm just going to go over to mine which is$ 38 million bajillion dollars with 99,999 estimated days to go um
*Matched patterns: api*

**Content:**
> and yeah let's actually run through this the first thing that I recommend you do is go over to playground on the Le hand side there's all of their different API endpoints that you can call um what I'm going to do is I'll just go to serp for now just to show you that you could scrape Google with this pretty easily
*Matched patterns: api*

**Content:**
> okay then I'm going to send a request to this API there's there's a bunch of other terms here that are going to make more sense if you're a SEO person um but now we receive as output a structured object with a ton of stuff
*Matched patterns: api*

**Content:**
> um you know we have a bun bunch of data here bunch of data you know you can use this to get URLs of specific things and then with the URLs you can then feed that into scrapers um that do more like I talked about earlier maybe appify or maybe rap API maybe fir crawl so a lot of options here to like create your own very complex flows you can do other stuff as well um you grab a bunch of keyword data
*Matched patterns: api*

**Content:**
> yeah looks like it's 390 per month so to the 390 people that are Googling me who are you and what do you want I'm just kidding um you can do things like you could find back links so you could find links um for I believe you feed in a website URL and then it finds back links to that website so this is you technically now scraping a bunch of other websites looking for links to the specific resource that you have that's kind of neat it looks like that found it basically immediately which is really really cool
*Matched patterns: api*

**Content:**
> and it looks like they're referring top level links that are Dooms BG bgs would be interesting I wonder where that's coming from um there's a Content generation API playground
*Matched patterns: api*

**Content:**
> but I think we're kind of getting away from um the actual thing that matters which is the scraping of the uh scraping of the websites so yeah lots of stuff lots of stuff for sure now that's all good
*Matched patterns: api*

**Content:**
> but let's actually turn this into an API call if we head over to the API of do data for SEO so in my case docs.
*Matched patterns: api*

**Content:**
> um well I have a curl just like this which I can feed into um an API request that's what I'm going to do
*Matched patterns: api*

**Content:**
> and I'm just going to import this curl import
*Matched patterns: import*

**Content:**
> but we have to convert it into something called base 64 um this is just how they do their API key stuff I guess it's kind of annoying
*Matched patterns: api*

**Content:**
> but it's just part and parcel of working with some apis you're just not always going to have it available to you really easily
*Matched patterns: api*

**Content:**
> so what we need to do is we need to base 64 encode the username and the password um I'm just going to leave that at what I've done is I've actually gone through and done it in this edit Fields node um basically what you need to do is you need to have your username or your login
*Matched patterns: code*

**Content:**
> and then my password is What's called the API password you can find that really quickly and easily just by going over here to API access and then API password if you just signed up it'll be visible right here if it's been more than 24 hours you actually have to send it by email
*Matched patterns: api*

**Content:**
> so that's um that's where i' get the API password from uh
*Matched patterns: api*

**Content:**
> and then once you feed it in over here where you're going to want to do is you're going to want to base 64 encode it like this they just require you to use these creds um or to operate with these creds as base 64 encoded versions Bas 64 is just a way to like translate into a slightly different number format so once you have that you would just feed in the variable right over here Ju
*Matched patterns: code, variable*

**Content:**
> Just as follows and then you can make a request to their API and receive data
*Matched patterns: api*

**Content:**
> I just sent a request and now I receive a bunch of links with different headings and and so on and so forth that's easy the seventh way to scrape websites and Ed end is using a third party application called crawl Bas they're known for their rotating proxies which allow you to send very high volume um API requests
*Matched patterns: api*

**Content:**
> so um it's very proxy driven this is their website so it's a scraping platform similar to Rapid API um and uh you know appify they support many of the major websites here and um the reason why they're so good at this is just because they you know as I mentioned they rotate the hell out of these proxies
*Matched patterns: api*

**Content:**
> so now we have a crawling API smart proxy thing if you guys want to run like uh I don't know use in apps that have a proxy field specifically I'm just going to keep things simple we're doing this in n8n
*Matched patterns: api*

**Content:**
> so we're going to go crawl base API we have a th000 free crawls remaining very first thing we're going to want to do is just click start crawling now just to get up and running with the API um and as you see here the these guys have probably one of the simplest apis possible all API URLs start with the folling base part click
*Matched patterns: api*

**Content:**
> and then all you need to do in order to make an API call is run the following sort of line
*Matched patterns: api*

**Content:**
> so this is a curl request obviously we're in n8n and one of the value valuable parts of NN is we can just import a COR request
*Matched patterns: import*

**Content:**
> so well I'm going to import it as you can see here we have a token field then we just have the URL field of the place we want to crawl so I'm going to do left click.
*Matched patterns: import*

**Content:**
> so I'm now running this and it looks like we just received a bunch of very spooky data I don't like the spooky data no spooky data for us um sometimes spooky data like this H this seems kind of weird to me actually just give me one second to make sure that's right we are receiving a data parameter back which is nice
*Matched patterns: parameter*

**Content:**
> so the reason why that's valuable is because if you're scraping one of these websites I talked about before where when you send a simple HTTP request nothing pops up like this is the this is the purpose of this you actually feed in a JavaScript
*Matched patterns: api*

**Content:**
> and then they grabbed the code afterwards
*Matched patterns: code*

**Content:**
> yeah we have some some API call stuff over here um this one's just using Amazon this is pretty interesting
*Matched patterns: api*

**Content:**
> and then we're just going to feed in the code here and then because I didn't feed in this we should now run this we're going to grab data from the site
*Matched patterns: code*

**Content:**
> but yeah very quick and easy way to use crawl base for this now the value in crawl base is not necessarily just to send them to static websites like I talked about it's to use like highly scalable scraping where you're scraping any applications consistently um as you see here the average API response time is between 4 to 10 seconds
*Matched patterns: api*

**Content:**
> right um sorry just jumping around the place here you can send 72,000 requests basically an hour which is crazy um and you can do so as quickly and as easily as just like adding an API call like
*Matched patterns: api*

**Content:**
> okay the eighth way to scrape data in nadn specifically website resources is octop parse octoparse is very similar to some of the other services that we've talked about um it is a web scraping tool that actually gives you quote unquote free web crawlers and I'm just a fan of their ux
*Matched patterns: api*

**Content:**
> so I should be able to jump through and show you guys what this looks like we have a verification code I'm going to paste in if you're not familiar with jumping around and stuff like this um or if you're wondering how I'm jumping around I'm just using a bunch of website hotkeys
*Matched patterns: code*

**Content:**
> yes I want to open this thank you and the cool thing about octoparse um kind of relative to what else you know like the other scraping applications I talked about is this is just running in a desktop app um like kind of in in your computer
*Matched patterns: api*

**Content:**
> and it's also local as opposed to a lot of these other ones which are not so I'm going to Auto log in on my desktop app remember my password beautiful the simplest and easiest way to scrape a s a service is just to pump in the the URL here then click Start and basically what'll happen is um it'll actually launch like an instance of your browser here with this little tool that allow you similarly the web scraping Chrome extension select the elements on the page you want scraped so I don't know maybe I want these logos scraped the second that I tapped one you'll see it automatically found six similar elements so now I'm actually like scraping all of this stuff
*Matched patterns: api*

**Content:**
> so as you see I'm now mapping each of these very similarly to how I was doing before between the first field which is the title of the product and then the second field which is like the field to uh so that's pretty sweet we could do the same thing with a number of things you could extract like the headings and then the values and so on and so on and so forth but I'll kind of leave it there um so once you're done selecting all the elements that you want all you do is you click run and you have a choice between running it on your device versus running it on the cloud so um on the cloud is API supported that's how you're going to get stuff in NM
*Matched patterns: api*

**Content:**
> so um you can dump this automatically to Google Sheets you could do zapier to connect to Google Sheets do like some sort of web Hook connection export to cloud storage uh similar stuff to the the web scraping Chrome extension um but for now let's just export this as Json give ourselves a little ad Json file here thank you
*Matched patterns: api*

**Content:**
> yeah now we have it locally now in order to connect with the octop par CPI what you're going to have to do is first you get up to request an access token the way that you do this is you send a post request to this URL here and the way that you format it is you need to send your username your password and then have the grantor type as password okay now password obviously just put in whatever your password is don't store it in PL text like I'm doing um with my hypothetical password put it somewhere else and then grab that data and then use it um but the the output of this is we have this big long access token variable which is great after that if I just go back to their API here um once we're here we can actually extract the data that we need so basically the thing that you're going to want is you're going to want um get data by Offset you can also use get non-exported data which is interesting so I think this just like dumps all of the data as not exported um and then sends that over to you
*Matched patterns: api, variable*

**Content:**
> but anyway you could also get the data by offset so if I go a get request to open api.
*Matched patterns: api*

**Content:**
> octop course.com SL all and then I just send a header with the URL parameter this is a get request uh we're going to send a header with the token so authorization Bearer and then feed in the access token here just make sure that this is just one space
*Matched patterns: parameter*

**Content:**
> so um we'll feed this in as query parameters here so send query parameters the first value was task ID second one was offset and uh offset is no Capital the third was size offset's going to be zero size going to be I don't know let's just do 1,000 and what we need now is we need the task ID of the specific run that we just finished oh in order to get the task list you head over to task list top right hand corner here task ID API
*Matched patterns: api, parameter*

**Content:**
> but I I like the idea that you can also just scrape locally which is pretty sweet and the last of our nine best ways to scrape websites in nadn is browserless now browserless runs a headless Chrome instance in the cloud this stuff is great for dynamic or heavy JavaScript websites if you've never used browser list before the cool part about browser list is allows you to actually bypass captas which is a big issue that a lot of people have um so I'm going to click try it for free I'm going to enter my email address over here verify I need to submit a code
*Matched patterns: code*

**Content:**
> so let's head back over here thank you thank you thank you thank you we have a ton of free trial signups obviously I don't have a promo code or anything don't have a company name
*Matched patterns: code*

**Content:**
> I'm just going to enter a password I'm using this to get past uh to avoid setting up a puppeteer and playright server sure I'm going to click complete we're now going to have a th credits inside of browser list which is pretty sweet um and we'll get a we'll get a full plan eventually we now have an API token
*Matched patterns: api*

**Content:**
> so I can figure out how all of the stuff works here I'm just going to dive right into the API I can figure out how all of the API stuff works using their API docs which are fantastic by the way
*Matched patterns: api*

**Content:**
> um and we don't want to do any of this stuff we just want to do HTTP apis brow list API index
*Matched patterns: api*

**Content:**
> so here's where we're at um if you want to send and receive a request what you need to do is uh you send a request to one of these endpoints content unblock download function PDF screenshot scrape or performance what we want for the purpose of this is just uh let's do content
*Matched patterns: function*

**Content:**
> so I'm just going to paste my API token up here copy this request feed it into nadn in the HTTP request module as per usual nice quick and easy I'm going to grab my API token
*Matched patterns: api*

**Content:**
> and where it says your API token here I'm going to feed that in what I want as a website is just left click.
*Matched patterns: api*

**Content:**
> and I'm just leaving this as a secret and sort of a little I guess Easter egg for people that have made it this far in the video like my go-to when scraping websites is as I mentioned do that HTTP request trans forg that works then do something like fir C.D
*Matched patterns: api*

**Content:**
> so I can make all my HTP requests really easy um especially when you know there's issues with captas and and accessing resources and stuff check this out not only can you do um the actual scrape you can do a screenshot of the page as well and because I've entered my token up here the requests that I'm going to setting up are as simple as importing the curl then clicking test step so straightforward we now have a file which is the screenshot now I used example domain there let's go left click.
*Matched patterns: import*

**Content:**
> I don't think I've actually used this one before but for the purposes of this demonstration why don't we give it a try we'll go over here import the curl paste it in voila the website
*Matched patterns: import*

**Content:**
> aai going to test this step so now there servers doing a couple things like I'm scraping the site then converting it all into PDF format um probably screenshotting a bunch of stuff too if I view this now we now have my my file looks like it didn't capture all of the color aspects um that might just be difficult or whatever
*Matched patterns: api*

**Content:**
> I hope you guys appreciated the nine best ways to scrape websites in nadn as you guys could see it's a combination of on platform scraping using the HTTP request module a lot of like API documentation stuff like that if you want to get good at this I'm releasing a master class on API stuff um uh as part of my next na tutorial video uh
*Matched patterns: api, class*

**Content:**
> and then you know navigating this and then and then taking the data from these services and using them to do something that you want to do like artificial intelligence to give you a summary of the site or generate ice breakers for you or do something else um whether you're using a local application like octop parse or maybe the web scraping CH uh Chrome extension or using something like firra browserless appify rapid API and so on and so forth um you now have everything that you need in order to scrape static sites Dynamic sites super Js heavy websites and even social media websites like Tik Tok Twitter and Instagram thanks so much for making it to this point in the video if you have any suggestions for future content drop them down below more than happy to take your idea and run with it assuming it's something that I haven't done before and then if you guys could do me a really big solid like subscribe do all that fun YouTube stuff
*Matched patterns: api*

---

### Config Instructions (11 items)

**Content:**
> so uh we're just going to go HTTP request HTTP request node looks like this we have a method field a URL field authentication field query parameters headers body and then some options down here as well all
*Matched patterns: options*

**Content:**
> but this one doesn't so just going to go over here I'm going to copy this puppy go back over here I'm going to paste this in now technically what this is called is this is called polling um polling uh is where you know you're you're you're attempting to request a resource that you don't know whether or not is ready and there's a fair amount of logic that I'd recommend like putting into a polling flow where like when you try it and if it doesn't work basically you wait a certain amount of time and you retry again for the purpose of this video I'm not going to put all that stuff inside but um what I'm going to do is just set up this request I'm going to give this puppy a test let's just feed that in on the back end we got to put the extract ID right right over here where it said extract ID
*Matched patterns: set up*

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites
*Matched patterns: install*

**Content:**
> um so we're going to run through what it looks like so first thing I'm going to want to do is I'm going to want to let's just go Cloud login or sorry um start free 7-Day trial as you can see you know there's a free browser extension here if you wanted to do uh I don't know like highs scale stuff you'd choose probably their project um endpoint where we Sorry project plan where we have 5,000 URL credits we can run a bunch of tasks in parallel we could scrape Dynamic sites JavaScript sites we have a bunch of different export options then we can also just connect it directly to all of these um what I'm going to do just because I want this to kind of work as a first go is I'm just going to sign up to a free Tri here beautiful just created my account just go left click give it a phone number we'll go left click.
*Matched patterns: options*

**Content:**
> so we basically have everything we need now to set up a flow where we can schedule something in this web scraper service that maybe monitors some I don't know list of e-commerce product or something every 12 hours
*Matched patterns: set up*

**Content:**
> and then we can set up a web hook in NN that will catch the notification get the update now we can do is we can ping um we can ping the web scraping API which I'll show you to set up in a second to request the data from that particular scraping run and from here we can take that data do whatever the heck we want with it but obviously let me show you an example of what the the actual data looks like so we just got the data from web hook let's set up an HTTP request to their API now where we basically get the ID of the thing
*Matched patterns: set up*

**Content:**
> but Cent how appify is is it is a Marketplace very similar to Rapid API um although extraordinarily well Main ained and they also have a ton of guides set up to help you get you know up and running with scraping any sort of application
*Matched patterns: set up*

**Content:**
> um obviously I was scraping an Instagram resource but like if you were scraping something else there'd be no change to this at all no change whatsoever now uh basically what we need in order to make this Dynamic basically make us able to run something in appify and then get it in NN so we need to set up an integration so just head over to this tab set up integration and then all you want to do is you just want to do web hook send an HTTP post web Hook when a specific actor event happens the actor event that we're going to want is basically when the run is succeeded the URL we're going to want to send this to if you think about it we just actually make another web hook request here web hook the URL we're going to want to send it to is going to be this test URL over here now I'm just going to delete all the header off stuff here because um it just uh complicates it especially for beginners
*Matched patterns: set up*

**Content:**
> I mean the options are ultimately unlimited that's why I love appify so much the sixth way to scrape websites with NN is data for Co this is another thirdparty service but it's a very high quality one that's specifically geared towards search engine optimization requests you guys haven't seen data for SEO before it's basically this big API stack that allows you to do things like automatically query a service maybe some e-commerce website or some content website and then like extract things in nicely structured formatting um again specifically for SEO purposes tons of apis here as well I mean a lot of these services are now going towards like more Marketplace style stuff
*Matched patterns: options*

**Content:**
> and then you could like feed that into one of any of the other scrapers that we set up here to get data on stuff you could go Google Images Google Maps you could do Bing BYO YouTube Google's uh their own data set feature I don't really know what that is
*Matched patterns: set up*

**Content:**
> um you know we have a bun bunch of data here bunch of data you know you can use this to get URLs of specific things and then with the URLs you can then feed that into scrapers um that do more like I talked about earlier maybe appify or maybe rap API maybe fir crawl so a lot of options here to like create your own very complex flows you can do other stuff as well um you grab a bunch of keyword data
*Matched patterns: options*

---

### Troubleshoot Instructions (10 items)

**Content:**
> so if you just understand that um you know when you scrape a dynamic resource what you're really doing is you're sending a request to a page which sends a request back to another server which then fills your thing this element eliminates 99% of the confusion because most of the time like scraping issues are hey
*Matched patterns: issue*

**Content:**
> so now we have the API request formatted correctly um all we need to do at this point is just click test step it looks like we're getting a Json breaking um error
*Matched patterns: error*

**Content:**
> then I'm just going to give this a test uh looks like I've issued a malformed request we just have to make sure that everything here is okay specify body let me just make sure there's nothing else in here it was a get request this is a get cool
*Matched patterns: issue*

**Content:**
> hi Nick I came across left click I'm impressed by you help B2B Founders scale their business automation keep in mind I never gave it my name it went it found my name on the website uh and then company name left click so quick and easy way uh you're going to have access to this template obviously without my API key in it um and feel free to you know use fir craw go nuts check out their documentation build out as complex a scraping flow as need be the third way to scrape websites in nadn is using rapid API for those of you that are unfamiliar rapid API is basically a giant Marketplace of third party scrapers similar to appify which I'll cover in a moment but instead of looking for um you know building out your own scraper for a resource let's say you're wanting to scrape Instagram or something that's not a simple static site what you can do is you could just get a scraper that somebody's already developed that does specifically that using proxies and all that tough stuff that I tend to abstract away um and then you just request uh to Rapid API which automatically handles the API request to the other thing that they want and then they format it and send it all back to and then you know you have beautiful um data that you could use for basically anything so this is what rapid API looks like it's basically a big Marketplace I just pumped in a search for website over here and we see 2,97 results to give you guys some context you can do everything from you know scraping social data like emails phone numbers and stuff like that from a website you could ping the ah refs SEO API you could find uh I don't know like unofficial medium data that they don't necessarily allow people to do so this is just a quick and easy way to I guess do a first pass after you've run through fir crawl maybe that doesn't work after you've run through HTTP request that doesn't work um just do a first pass look for something that scrapes the exact resource you're looking for and then take it from there so obviously for the purpose of this I'm just going to use the website to scraper API which is sort of just like a wrapper around what we're doing right now in nadn um but this website scraper API allows you to scrape some more Dynamic data um now I'm not signed up to this
*Matched patterns: handle*

**Content:**
> but maybe if you want to scrape like 5,000 doing it the way that I was doing it a moment ago might might be infusible the next way to scrape websites in nadn is using the web scraper Chrome extension and then tying that to a cloud service that delivers the data that you just created using their no code tool um in nicely bundled formats it's called Cloud sync as of the time of this recording I think they changed the name a couple of times but um that's where we're at here is the name of the service web scraper here is their website essentially what happens is you install a little Chrome plugin which I'll show you guys how to do then you select the fields that you want scraped in various data formats and then what you do is it handles JavaScript sites
*Matched patterns: handle*

**Content:**
> and then we can set up a web hook in NN that will catch the notification get the update now we can do is we can ping um we can ping the web scraping API which I'll show you to set up in a second to request the data from that particular scraping run and from here we can take that data do whatever the heck we want with it but obviously let me show you an example of what the the actual data looks like so we just got the data from web hook let's set up an HTTP request to their API now where we basically get the ID of the thing
*Matched patterns: catch*

**Content:**
> so I'm going to listen for this test event I'm going to run the same scraper again maybe we'll make it five posts per profile just to make it a little faster and um once this is done what it's going to do is it's going to send a record of all the information we need to get the data over to Ann we're going to catch that information
*Matched patterns: catch*

**Content:**
> but I I like the idea that you can also just scrape locally which is pretty sweet and the last of our nine best ways to scrape websites in nadn is browserless now browserless runs a headless Chrome instance in the cloud this stuff is great for dynamic or heavy JavaScript websites if you've never used browser list before the cool part about browser list is allows you to actually bypass captas which is a big issue that a lot of people have um so I'm going to click try it for free I'm going to enter my email address over here verify I need to submit a code
*Matched patterns: issue*

**Content:**
> so I can make all my HTP requests really easy um especially when you know there's issues with captas and and accessing resources and stuff check this out not only can you do um the actual scrape you can do a screenshot of the page as well and because I've entered my token up here the requests that I'm going to setting up are as simple as importing the curl then clicking test step so straightforward we now have a file which is the screenshot now I used example domain there let's go left click.
*Matched patterns: issue*

**Content:**
> and I'll catch you on the next video thank you very much
*Matched patterns: catch*

---
