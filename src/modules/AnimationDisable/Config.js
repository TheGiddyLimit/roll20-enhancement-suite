import MakeConfig from "../MakeConfig";
import ConfigViews from "../../tools/ConfigViews";
import Category from "../Category";

export default MakeConfig(__dirname, {
    id: "animationDisable",
    name: "Disable Animations",
    description: "Disables animations that can be configured in the options section.",
    category: Category.canvas,
    media: {
        "no_radial_anim.webm": "No token radial menu animation"
    },

    mods: [
        { // radial button proportionally timed animation
            includes: "assets/app.js",
            find: `setTimeout(function(){$(e).addClass("open"),o.find(".button div.hasnumber").textfill(20)},30*a),a++`,
            patch: `;
            if(window.r20esanims && window.r20esanims.disableRadial) { $(e).addClass("open");o.find(".button div.hasnumber").textfill(20);}
            else { >>R20ES_MOD_FIND>>; }`,
        },

        { // radial final
            includes: "assets/app.js",
            find: `setTimeout(function(){o.find(".button").addClass("animcomplete")},250)`,
            patch: `1;
            if(window.r20esanims && window.r20esanims.disableRadial) { o.find(".button").addClass("animcomplete");}
            else { >>R20ES_MOD_FIND>>; }`,
        },

        { // marker menu hide
            includes: "assets/app.js",
            find: `setTimeout(function(){p&&p.remove()},300)`,
            patch: `1;
            if(window.r20esanims && window.r20esanims.disableRadial) { p && p.remove(); }
            else { >>R20ES_MOD_FIND>>; }`,
        },

        { // marker menu show
            includes: "assets/app.js",
            find: `_.delay(function(){d.addClass("open")})`,
            patch: `1;
            if(window.r20esanims && window.r20esanims.disableRadial) { d.addClass("open"); }
            else { >>R20ES_MOD_FIND>>; }`
        }
    ],

    configView: {
        disableRadial: {
            type: ConfigViews.Checkbox,
            display: "Disable token radial button menu animations"
        }
    },

    config: {
        disableRadial: false,
    },
});
