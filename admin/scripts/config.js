---
---
window.CMS_MANUAL_INIT = true;

var site_authors = {{ site.authors | jsonify }};
var site_months = {{ site.data.months | jsonify }};
var site_categories = {{ site.data.categoriestext | jsonify}};


var pagelayouts = ["default", "blank"];

var collectionCategories = [];
for(cat in site_categories){ 
    collectionCategories.push({ "label": site_categories[cat].text, "value": site_categories[cat].name });
}

var collections = 
[
    {
        "name": "post",
        "label": "Posts",
        "label_singular": "Post",
        "folder": "_posts",
        "create": true,
        "slug": "{% raw %}{{year}}-{{month}}-{{day}}-{{hour}}-{{minute}}-{{slug}}{% endraw %}",
        "fields": [
            { "label": "Layout", "name": "layout", "widget": "hidden", "default": "post" },
            { "label": "Hidden", "name": "hidden", "widget": "boolean", "default": true },
            { "label": "Title", "name": "title", "widget": "string" },
            { "label": "Subtitle", "name": "subtitle", "widget": "string" },
            { "label": "Author", "name": "author", "widget": "select", "default": "Antonia", "options":
                [
                { label: "Антония", value: "Antonia" },
                { label: "Гост-автор", value: "Guest" }
                ]
            },
            { "label": "Guest author name", "name": "guestauthorname", "widget": "string", "required": false },
            { "label": "Guest author photo",  "name": "guestauthorimage", "widget": "image", "required": false, "media_library": { "config": {"multiple": false }}},
            { "label": "Featured Image", "name": "image","widget": "image", "media_library":{ "config": {"multiple": true }}},
            { "label": "Body", "name": "body", "widget": "markdown" },
            {"label": "Category", "name": "category", "widget": "select", "default": "interviews", "required": true, "options": collectionCategories },
            {"label": "Secondary category", "name": "category2", "widget": "select", "default": "", "required": false, "options": collectionCategories },            
            { "label": "Tags", "name": "tags", "widget": "tag-picker" },
            { "label": "Ozone.bg book link", "name": "ozone-link", "widget": "string", "required": false },
            { "label": "Schedule publish at",  "name": "schedule", "widget": "datetime", "default": "", "format": "YYYY-MM-DD HH:mm", "dateFormat": "YYYY-MM-DD", "timeFormat": "HH:mm",  "required": false },
            { "label": "Redirect from", "name": "redirect_from", "widget": "list", "required": false }
        ]
    }
];

var configurations = 
{
    "development": {
        "config": {
        "backend": {
            "name": "git-gateway"
        },
        "local_backend": true,
        "load_config_file": false,
        "media_folder": "/Uploads",
        "public_folder": "/Uploads",
        "slug": {
            "encoding" : "unicode",
            "clean_accents": false,
            "sanitize_replacement": "-"
        },
        "collections": collections
        }
    },
    "production": {
        "config": {
        "backend": {
            "name": "github",
            "repo": "literaturnirazgovori/literaturnirazgovori.github.io",
            "branch": "work",
            "base_url": "https://warm-woodland-78106.herokuapp.com"
        },
        "local_backend": false,
        "load_config_file": false,
        "media_folder": "/Uploads",
        "public_folder": "/Uploads",
        "slug": {
            "encoding" : "unicode",
            "clean_accents": false,
            "sanitize_replacement": "-"
        },        
        "collections": collections
        }
    }
}




