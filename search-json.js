---
---
var search_json_index = [
    {% for post in site.posts %}
      {% unless post.hidden %}    
        {
            "title": "{{ post.title | escape }}",
            "url": "{{ site.baseurl }}{{ post.url }}",
            "category": "{{ post.category }}",
            "category2": "{{ post.category2 }}",
            "tags": "{{ post.tags | join: ', ' }}",
            "date": "{{ post.date }}",
            "image": "{{ post.image }}",
            "author": "{{ post.author }}",
            "subtitle": "{{ post.subtitle | escape }}"
        } 
        {% unless forloop.last %},
        {% endunless %}
    {% endunless %}
  {% endfor %}
];