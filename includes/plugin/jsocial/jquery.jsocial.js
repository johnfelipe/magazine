/*
* FLICKR PLUGIN
* Copyright (C) 2009 Joel Sutherland
* Licenced under the MIT license
* http://www.newmediacampaigns.com/page/jquery-flickr-plugin
*
* Available tags for templates:
* title, link, date_taken, description, published, author, author_id, tags, image*
*/
(function($){$.fn.jflickrfeed=function(settings,callback){settings=$.extend(true,{flickrbase:'http://api.flickr.com/services/feeds/',feedapi:'photos_public.gne',limit:20,qstrings:{lang:'en-us',format:'json',jsoncallback:'?'},cleanDescription:true,useTemplate:true,itemTemplate:'',itemCallback:function(){}},settings);var url=settings.flickrbase+settings.feedapi+'?';var first=true;for(var key in settings.qstrings){if(!first)
url+='&';url+=key+'='+settings.qstrings[key];first=false;}
return $(this).each(function(){var $container=$(this);var container=this;$.getJSON(url,function(data){$.each(data.items,function(i,item){if(i<settings.limit){if(settings.cleanDescription){var regex=/<p>(.*?)<\/p>/g;var input=item.description;if(regex.test(input)){item.description=input.match(regex)[2]
if(item.description!=undefined)
item.description=item.description.replace('<p>','').replace('</p>','');}}
item['image_s']=item.media.m.replace('_m','_s');item['image_t']=item.media.m.replace('_m','_t');item['image_m']=item.media.m.replace('_m','_m');item['image']=item.media.m.replace('_m','');item['image_b']=item.media.m.replace('_m','_b');delete item.media;if(settings.useTemplate){var template=settings.itemTemplate;for(var key in item){var rgx=new RegExp('{{'+key+'}}','g');template=template.replace(rgx,item[key]);}
$container.append(template)}
settings.itemCallback.call(container,item);}});if($.isFunction(callback)){callback.call(container,data);}});});}})(jQuery);


/*
* TWITTER PLUGIN
* Copyright (C) seaofclouds
* Licenced under the MIT license
* http://tweet.seaofclouds.com
*
*/

(function($) {

  $.fn.tweet = function(o){
    var s = $.extend({
      username: null,                           // [string or array] required unless using the 'query' option; one or more twitter screen names
      list: null,                               // [string]   optional name of list belonging to username
      favorites: false,                         // [boolean]  display the user's favorites instead of his tweets
      query: null,                              // [string]   optional search query
      avatar_size: null,                        // [integer]  height and width of avatar if displayed (48px max)
      count: 3,                                 // [integer]  how many tweets to display?
      fetch: null,                              // [integer]  how many tweets to fetch via the API (set this higher than 'count' if using the 'filter' option)
      retweets: true,                           // [boolean]  whether to fetch (official) retweets (not supported in all display modes)
      intro_text: null,                         // [string]   do you want text BEFORE your your tweets?
      outro_text: null,                         // [string]   do you want text AFTER your tweets?
      join_text:  null,                         // [string]   optional text in between date and tweet, try setting to "auto"
      auto_join_text_default: "i said,",        // [string]   auto text for non verb: "i said" bullocks
      auto_join_text_ed: "i",                   // [string]   auto text for past tense: "i" surfed
      auto_join_text_ing: "i am",               // [string]   auto tense for present tense: "i was" surfing
      auto_join_text_reply: "i replied to",     // [string]   auto tense for replies: "i replied to" @someone "with"
      auto_join_text_url: "i was looking at",   // [string]   auto tense for urls: "i was looking at" http:...
      loading_text: null,                       // [string]   optional loading text, displayed while tweets load
      refresh_interval: null ,                  // [integer]  optional number of seconds after which to reload tweets
      twitter_url: "twitter.com",               // [string]   custom twitter url, if any (apigee, etc.)
      twitter_api_url: "api.twitter.com",       // [string]   custom twitter api url, if any (apigee, etc.)
      twitter_search_url: "search.twitter.com", // [string]   custom twitter search url, if any (apigee, etc.)
      template: "{avatar}{time}{join}{text}",   // [string or function] template used to construct each tweet <li> - see code for available vars
      comparator: function(tweet1, tweet2) {    // [function] comparator used to sort tweets (see Array.sort)
        return tweet2["tweet_time"] - tweet1["tweet_time"];
      },
      filter: function(tweet) {                 // [function] whether or not to include a particular tweet (be sure to also set 'fetch')
        return true;
      }
    }, o);

    $.fn.extend({
      linkUrl: function() {
        var returning = [];
        // See http://daringfireball.net/2010/07/improved_regex_for_matching_urls
        var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?Â«Â»â€œâ€â€˜â€™]))/gi;
        this.each(function() {
          returning.push(this.replace(regexp,
                                      function(match) {
                                        var url = (/^[a-z]+:/i).test(match) ? match : "http://"+match;
                                        return "<a href=\""+url+"\">"+match+"</a>";
                                      }));
        });
        return $(returning);
      },
      linkUser: function() {
        var returning = [];
        var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
        this.each(function() {
          returning.push(this.replace(regexp,"<a href=\"http://"+s.twitter_url+"/$1\">@$1</a>"));        });
        return $(returning);
      },
      linkHash: function() {
        var returning = [];
        var regexp = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
        var usercond = s.username ? '&from='+s.username.join("%2BOR%2B") : '';
        this.each(function() {
          returning.push(this.replace(regexp, ' <a href="http://'+s.twitter_search_url+'/search?q=&tag=$1&lang=all'+usercond+'">#$1</a>'));
        });
        return $(returning);
      },
      capAwesome: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/\b(awesome)\b/gi, '<span class="awesome">$1</span>'));
        });
        return $(returning);
      },
      capEpic: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/\b(epic)\b/gi, '<span class="epic">$1</span>'));
        });
        return $(returning);
      },
      makeHeart: function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>"));
        });
        return $(returning);
      }
    });

    function parse_date(date_str) {
      // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
      // cannot handle in IE. We therefore perform the following transformation:
      // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
      return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
    }

    function relative_time(date) {
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - date) / 1000, 10);
      var r = '';
      if (delta < 60) {
        r = delta + ' seconds ago';
      } else if(delta < 120) {
        r = 'a minute ago';
      } else if(delta < (45*60)) {
        r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
      } else if(delta < (2*60*60)) {
        r = 'an hour ago';
      } else if(delta < (24*60*60)) {
        r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
      } else if(delta < (48*60*60)) {
        r = 'a day ago';
      } else {
        r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
      }
      return 'about ' + r;
    }

    function build_url() {
      var proto = ('https:' == document.location.protocol ? 'https:' : 'http:');
      var count = (s.fetch === null) ? s.count : s.fetch;
      if (s.list) {
        return proto+"//"+s.twitter_api_url+"/1/"+s.username[0]+"/lists/"+s.list+"/statuses.json?per_page="+count+"&callback=?";
      } else if (s.favorites) {
        return proto+"//"+s.twitter_api_url+"/favorites/"+s.username[0]+".json?count="+s.count+"&callback=?";
      } else if (s.query === null && s.username.length == 1) {
        return proto+'//'+s.twitter_api_url+'/1/statuses/user_timeline.json?screen_name='+s.username[0]+'&count='+count+(s.retweets ? '&include_rts=1' : '')+'&callback=?';
      } else {
        var query = (s.query || 'from:'+s.username.join(' OR from:'));
        return proto+'//'+s.twitter_search_url+'/search.json?&q='+encodeURIComponent(query)+'&rpp='+count+'&callback=?';
      }
    }

    return this.each(function(i, widget){
      var list = $('<ul class="tweet_list">').appendTo(widget);
      var intro = '<p class="tweet_intro">'+s.intro_text+'</p>';
      var outro = '<p class="tweet_outro">'+s.outro_text+'</p>';
      var loading = $('<p class="loading">'+s.loading_text+'</p>');

      if(s.username && typeof(s.username) == "string"){
        s.username = [s.username];
      }

      var expand_template = function(info) {
        if (typeof s.template === "string") {
          var result = s.template;
          for(var key in info)
            result = result.replace(new RegExp('{'+key+'}','g'), info[key]);
          return result;
        } else return s.template(info);
      };

      if (s.loading_text) $(widget).append(loading);
      $(widget).bind("load", function(){
        $.getJSON(build_url(), function(data){
          if (s.loading_text) loading.remove();
          if (s.intro_text) list.before(intro);
          list.empty();

          var tweets = $.map(data.results || data, function(item){
            var join_text = s.join_text;

            // auto join text based on verb tense and content
            if (s.join_text == "auto") {
              if (item.text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
                join_text = s.auto_join_text_reply;
              } else if (item.text.match(/(^\w+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+) .*/i)) {
                join_text = s.auto_join_text_url;
              } else if (item.text.match(/^((\w+ed)|just) .*/im)) {
                join_text = s.auto_join_text_ed;
              } else if (item.text.match(/^(\w*ing) .*/i)) {
                join_text = s.auto_join_text_ing;
              } else {
                join_text = s.auto_join_text_default;
              }
            }

            // Basic building blocks for constructing tweet <li> using a template
            var screen_name = item.from_user || item.user.screen_name;
            var source = item.source;
            var user_url = "http://"+s.twitter_url+"/"+screen_name;
            var avatar_size = s.avatar_size;
            var avatar_url = item.profile_image_url || item.user.profile_image_url;
            var tweet_url = "http://"+s.twitter_url+"/"+screen_name+"/statuses/"+item.id_str;
            var retweet = (typeof(item.retweeted_status) != 'undefined');
            var retweeted_screen_name = retweet ? item.retweeted_status.user.screen_name : null;
            var tweet_time = parse_date(item.created_at);
            var tweet_relative_time = relative_time(tweet_time);
            var tweet_raw_text = retweet ? ('RT @'+retweeted_screen_name+' '+item.retweeted_status.text) : item.text; // avoid '...' in long retweets
            var tweet_text = $([tweet_raw_text]).linkUrl().linkUser().linkHash()[0];

            // Default spans, and pre-formatted blocks for common layouts
            var user = '<a class="tweet_user" href="'+user_url+'">'+screen_name+'</a>';
            var join = ((s.join_text) ? ('<span class="tweet_join"> '+join_text+' </span>') : ' ');
            var avatar = (avatar_size ?
                          ('<a class="tweet_avatar" href="'+user_url+'"><img src="'+avatar_url+
                           '" height="'+avatar_size+'" width="'+avatar_size+
                           '" alt="'+screen_name+'\'s avatar" title="'+screen_name+'\'s avatar" border="0"/></a>') : '');
            var time = '<span class="tweet_time"><a href="'+tweet_url+'" title="view tweet on twitter">'+tweet_relative_time+'</a></span>';
            var text = '<span class="tweet_text">'+$([tweet_text]).makeHeart().capAwesome().capEpic()[0]+ '</span>';

            return { item: item, // For advanced users who want to dig out other info
                     screen_name: screen_name,
                     user_url: user_url,
                     avatar_size: avatar_size,
                     avatar_url: avatar_url,
                     source: source,
                     tweet_url: tweet_url,
                     tweet_time: tweet_time,
                     tweet_relative_time: tweet_relative_time,
                     tweet_raw_text: tweet_raw_text,
                     tweet_text: tweet_text,
                     retweet: retweet,
                     retweeted_screen_name: retweeted_screen_name,
                     user: user,
                     join: join,
                     avatar: avatar,
                     time: time,
                     text: text
                   };
          });

          tweets = $.grep(tweets, s.filter).slice(0, s.count);
          list.append($.map(tweets.sort(s.comparator),
                            function(t) { return "<li>" + expand_template(t) + "</li>"; }).join('')).
              children('li:first').addClass('tweet_first').end().
              children('li:odd').addClass('tweet_even').end().
              children('li:even').addClass('tweet_odd');

          if (s.outro_text) list.after(outro);
          $(widget).trigger("loaded").trigger((tweets.length === 0 ? "empty" : "full"));
          if (s.refresh_interval) {
            window.setTimeout(function() { $(widget).trigger("load"); }, 1000 * s.refresh_interval);
          }
        });
      }).trigger("load");
    });
  };
})(jQuery);

/**
 * jQuery Plugin - Jribbble v0.11.0
 * A jQuery plugin to fetch shot and player data from the Dribbble API, 
 * http://dribbble.com/api
 * 
 * Copyright (c) 2011 Tyler Gaw
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 *
 * Date: Mon Jun 27 09:48:19 2011 -0400
 *
 */(function(a){"use strict",a.fn.jribbble=function(){this.makeRequest=function(b,c,d){var e=function(b){a.isFunction(c)&&c(b)},f=b.replace("//","/");a.ajax({data:d,dataType:"jsonp",success:e,type:"GET",url:a.jribbble.baseUrl+f})};return this},a.jribbble={},a.jribbble.baseUrl="http://api.dribbble.com",a.jribbble.paths={shots:"/shots/",rebounds:"/rebounds/",following:"/following/",players:"/players/",followers:"/followers/",draftees:"/draftees/",comments:"/comments/"},a.jribbble.getShotById=function(b,c){var d=a.jribbble.paths.shots+b;a.fn.jribbble().makeRequest(d,c)},a.jribbble.getReboundsOfShot=function(b,c,d){var e=a.jribbble.paths.shots+b+a.jribbble.paths.rebounds;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getShotsByList=function(b,c,d){var e=a.jribbble.paths.shots+b;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getShotsByPlayerId=function(b,c,d){var e=a.jribbble.paths.players+b+a.jribbble.paths.shots;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getShotsThatPlayerFollows=function(b,c,d){var e=a.jribbble.paths.players+b+a.jribbble.paths.shots+a.jribbble.paths.following;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getPlayerById=function(b,c){var d=a.jribbble.paths.players+b;a.fn.jribbble().makeRequest(d,c)},a.jribbble.getPlayerFollowers=function(b,c,d){var e=a.jribbble.paths.players+b+a.jribbble.paths.followers;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getPlayerFollowing=function(b,c,d){var e=a.jribbble.paths.players+b+a.jribbble.paths.following;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getPlayerDraftees=function(b,c,d){var e=a.jribbble.paths.players+b+a.jribbble.paths.draftees;a.fn.jribbble().makeRequest(e,c,d)},a.jribbble.getCommentsOfShot=function(b,c,d){var e=a.jribbble.paths.shots+b+a.jribbble.paths.comments;a.fn.jribbble().makeRequest(e,c,d)}})(jQuery);

/*!
 * Socialite v2.0
 * http://socialitejs.com
 * Copyright (c) 2011 David Bushell
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
window.Socialite=function(a,b,c){"use strict";var d=0,e=[],f={},g={},h=/^($|loaded|complete)/,i=a.encodeURIComponent,j={settings:{},hasClass:function(a,b){return(" "+a.className+" ").indexOf(" "+b+" ")!==-1},addClass:function(a,b){j.hasClass(a,b)||(a.className=a.className===""?b:a.className+" "+b)},removeClass:function(a,b){a.className=(" "+a.className+" ").replace(" "+b+" "," ")},extendObject:function(a,b,d){for(var e in b){var f=a[e]!==c;if(f&&typeof b[e]=="object")j.extendObject(a[e],b[e],d);else if(d||!f)a[e]=b[e]}},getElements:function(a,b){var c=0,d=[],e=!!a.getElementsByClassName,f=e?a.getElementsByClassName(b):a.getElementsByTagName("*");for(;c<f.length;c++)(e||j.hasClass(f[c],b))&&d.push(f[c]);return d},getDataAttributes:function(a,b,c){var d=0,e="",f={},g=a.attributes;for(;d<g.length;d++){var h=g[d].name,j=g[d].value;j.length&&h.indexOf("data-")===0&&(b&&(h=h.substring(5)),c?f[h]=j:e+=i(h)+"="+i(j)+"&")}return c?f:e},copyDataAttributes:function(a,b,c,d){var e=j.getDataAttributes(a,c,!0);for(var f in e)b.setAttribute(d?f.replace(/-/g,"_"):f,e[f])},createIframe:function(a,c){var d=b.createElement("iframe");return d.style.cssText="overflow: hidden; border: none;",j.extendObject(d,{src:a,allowtransparency:"true",frameborder:"0",scrolling:"no"},!0),c&&(d.onload=d.onreadystatechange=function(){h.test(d.readyState||"")&&(d.onload=d.onreadystatechange=null,j.activateInstance(c))}),d},networkReady:function(a){return f[a]?f[a].loaded:c},appendNetwork:function(a){if(!a||a.appended)return;if(typeof a.append=="function"&&a.append(a)===!1){a.appended=a.loaded=!0,j.activateAll(a);return}a.script&&(a.el=b.createElement("script"),j.extendObject(a.el,a.script,!0),a.el.async=!0,a.el.onload=a.el.onreadystatechange=function(){if(h.test(a.el.readyState||"")){a.el.onload=a.el.onreadystatechange=null,a.loaded=!0;if(typeof a.onload=="function"&&a.onload(a)===!1)return;j.activateAll(a)}},b.body.appendChild(a.el)),a.appended=!0},removeNetwork:function(a){return j.networkReady(a.name)?(a.el.parentNode.removeChild(a.el),!(a.appended=a.loaded=!1)):!1},reloadNetwork:function(a){var b=f[a];b&&j.removeNetwork(b)&&j.appendNetwork(b)},createInstance:function(a,b){var f=!0,g={el:a,uid:d++,widget:b};return e.push(g),b.process!==c&&(f=typeof b.process=="function"?b.process(g):!1),f&&j.processInstance(g),g.el.setAttribute("data-socialite",g.uid),g.el.className="socialite "+b.name+" socialite-instance",g},processInstance:function(a){var c=a.el;a.el=b.createElement("div"),a.el.className=c.className,j.copyDataAttributes(c,a.el),c.nodeName.toLowerCase()==="a"&&!c.getAttribute("data-default-href")&&a.el.setAttribute("data-default-href",c.getAttribute("href"));var d=c.parentNode;d.insertBefore(a.el,c),d.removeChild(c)},activateInstance:function(a){if(a&&!a.loaded)return a.loaded=!0,typeof a.widget.activate=="function"&&a.widget.activate(a),j.addClass(a.el,"socialite-loaded"),a.onload?a.onload(a.el):null},activateAll:function(a){typeof a=="string"&&(a=f[a]);for(var b=0;b<e.length;b++){var c=e[b];c.init&&c.widget.network===a&&j.activateInstance(c)}},load:function(a,c,d,f,h){a=a&&typeof a=="object"&&a.nodeType===1?a:b;if(!c||typeof c!="object"){j.load(a,j.getElements(a,"socialite"),d,f,h);return}var i;if(/Array/.test(Object.prototype.toString.call(c))){for(i=0;i<c.length;i++)j.load(a,c[i],d,f,h);return}if(c.nodeType!==1)return;if(!d||!g[d]){d=null;var k=c.className.split(" ");for(i=0;i<k.length;i++)if(g[k[i]]){d=k[i];break}if(!d)return}var l,m=g[d],n=parseInt(c.getAttribute("data-socialite"),10);if(!isNaN(n)){for(i=0;i<e.length;i++)if(e[i].uid===n){l=e[i];break}}else l=j.createInstance(c,m);if(h||!l)return;l.init||(l.init=!0,l.onload=typeof f=="function"?f:null,m.init(l)),m.network.appended?j.networkReady(m.network.name)&&j.activateInstance(l):j.appendNetwork(m.network)},activate:function(b,c,d){a.Socialite.load(null,b,c,d)},process:function(b,c,d){a.Socialite.load(b,c,d,null,!0)},network:function(a,b){f[a]={name:a,el:null,appended:!1,loaded:!1,widgets:{}},b&&j.extendObject(f[a],b)},widget:function(a,b,c){c.name=a+"-"+b;if(!f[a]||g[c.name])return;c.network=f[a],f[a].widgets[b]=g[c.name]=c},setup:function(a){j.extendObject(j.settings,a,!0)}};return j}(window,window.document),function(a,b,c,d){c.setup({facebook:{lang:"en_GB",appId:null},twitter:{lang:"en"},googleplus:{lang:"en-GB"}}),c.network("facebook",{script:{src:"//connect.facebook.net/{{language}}/all.js",id:"facebook-jssdk"},append:function(d){var e=b.createElement("div"),f=c.settings.facebook,g={onlike:"edge.create",onunlike:"edge.remove",onsend:"message.send"};e.id="fb-root",b.body.appendChild(e),d.script.src=d.script.src.replace("{{language}}",f.lang),a.fbAsyncInit=function(){a.FB.init({appId:f.appId,xfbml:!0});for(var b in g)typeof f[b]=="function"&&a.FB.Event.subscribe(g[b],f[b])}}}),c.widget("facebook","like",{init:function(d){var e=b.createElement("div");e.className="fb-like",c.copyDataAttributes(d.el,e),d.el.appendChild(e),a.FB&&a.FB.XFBML&&a.FB.XFBML.parse(d.el)}}),c.network("twitter",{script:{src:"//platform.twitter.com/widgets.js",id:"twitter-wjs",charset:"utf-8"},append:function(){var b=typeof a.twttr!="object",d=c.settings.twitter,e=["click","tweet","retweet","favorite","follow"];return b&&(a.twttr=t={_e:[],ready:function(a){t._e.push(a)}}),a.twttr.ready(function(a){for(var b=0;b<e.length;b++){var f=e[b];typeof d["on"+f]=="function"&&a.events.bind(f,d["on"+f])}c.activateAll("twitter")}),b}});var e=function(a){var d=b.createElement("a");d.className=a.widget.name+"-button",c.copyDataAttributes(a.el,d),d.setAttribute("href",a.el.getAttribute("data-default-href")),d.setAttribute("data-lang",a.el.getAttribute("data-lang")||c.settings.twitter.lang),a.el.appendChild(d)},f=function(b){a.twttr&&typeof a.twttr.widgets=="object"&&typeof a.twttr.widgets.load=="function"&&a.twttr.widgets.load()};c.widget("twitter","share",{init:e,activate:f}),c.widget("twitter","follow",{init:e,activate:f}),c.widget("twitter","hashtag",{init:e,activate:f}),c.widget("twitter","mention",{init:e,activate:f}),c.widget("twitter","embed",{process:function(a){a.innerEl=a.el,a.innerEl.getAttribute("data-lang")||a.innerEl.setAttribute("data-lang",c.settings.twitter.lang),a.el=b.createElement("div"),a.el.className=a.innerEl.className,a.innerEl.className="",a.innerEl.parentNode.insertBefore(a.el,a.innerEl),a.el.appendChild(a.innerEl)},init:function(a){a.innerEl.className="twitter-tweet"},activate:f}),c.network("googleplus",{script:{src:"//apis.google.com/js/plusone.js"},append:function(b){if(a.gapi)return!1;a.___gcfg={lang:c.settings.googleplus.lang,parsetags:"explicit"}}});var g=function(a){var d=b.createElement("div");d.className="g-"+a.widget.gtype,c.copyDataAttributes(a.el,d),a.el.appendChild(d)},h=function(a,b){return typeof b!="function"?null:function(c){b(a.el,c)}},i=function(b){var d=b.widget.gtype;if(a.gapi&&a.gapi[d]){var e=c.settings.googleplus,f=c.getDataAttributes(b.el,!0,!0),g=["onstartinteraction","onendinteraction","callback"];for(var i=0;i<g.length;i++)f[g[i]]=h(b,e[g[i]]);a.gapi[d].render(b.el,f)}};c.widget("googleplus","one",{init:g,activate:i,gtype:"plusone"}),c.widget("googleplus","share",{init:g,activate:i,gtype:"plus"}),c.network("linkedin",{script:{src:"//platform.linkedin.com/in.js"}});var j=function(d){var e=b.createElement("script");e.type="IN/"+d.widget.intype,c.copyDataAttributes(d.el,e),d.el.appendChild(e),typeof a.IN=="object"&&typeof a.IN.parse=="function"&&(a.IN.parse(d.el),c.activateInstance(d))};c.widget("linkedin","share",{init:j,intype:"Share"}),c.widget("linkedin","recommend",{init:j,intype:"RecommendProduct"})}(window,window.document,window.Socialite),function(){var a=window._socialite;if(/Array/.test(Object.prototype.toString.call(a)))for(var b=0,c=a.length;b<c;b++)typeof a[b]=="function"&&a[b]()}();