---
---
/*
A custom tag picker control, allowing selection of existing tags, adding new ones, in an intuitive UI
*/
var site_tags = [{% assign tags = site.tags | sort %}{% for tag in tags %}{% if forloop.first != true %},{% endif %}"{{ tag[0] }}"{% endfor %}];

/// tagsControl
/// This is the main tag-picker control, with all its functionality
var tagsControl = createClass({
    
    /// addtag
    /// Adds a tag (by string) to the selected control's collection
    addtag : function(newtag){
      var current = this.props.value;
      if(!newtag)
      {
        return;
      }
      if(!current || typeof currrent == 'number')
      {
        
        current = [];
        current.push(newtag);
      }
      else
      {
        if((Array.isArray(current)) && (current.indexOf(newtag) < 0))
        {
          var newarr = current.slice();
          current = newarr;
          current.push(newtag);
        }
        else if(typeof current == 'object' && current.toArray)
        {
          current = current.toArray();
          current.push(newtag);
        }
        else 
        {
          if(typeof current == 'string')
          {
            var arr = [];
            arr.push(current);
            arr.push(newtag);
            current = arr;
          }
        }
      }
      this.props.onChange(current);
    },

    /// gettags
    /// Returns all the selected tags currently in the control's collection
    gettags : function()
    {
      var current = this.props.value;
      if(current)
      {
        if(typeof current == 'string')
        {
          return [current];
        }
        else if (Array.isArray(current))
        {
          return current;
        }
        else if (current.toArray)
        {
          return current.toArray();
        }
      }
      return [];
    },

    /// removetag
    /// Removes a tag (by string) from the selected control's collection
    removetag : function(oldtag){
      console.log("--=---=- removetag: " + oldtag);
      var current = this.props.value;
      if(!current || !oldtag)
      {
        return;
      }
      else
      {
        if(Array.isArray(current))
        {
          var newarr = current.slice();
          current = newarr;
          var indexOfLastDisplayedTag = current.indexOf(oldtag);
          if (indexOfLastDisplayedTag >= 0)
          {
            current.splice(indexOfLastDisplayedTag, 1);
          }
        }
        else if(typeof current == 'object' && current.toArray)
        {
          current = current.toArray();
          var indexOfLastDisplayedTag = current.indexOf(oldtag);
          if (indexOfLastDisplayedTag >= 0)
          {
            current.splice(indexOfLastDisplayedTag, 1);
          }
        }

        else 
        {
          if(typeof current == 'string')
          {
            if(current != oldtag)
            {
              return;
            }
            else
            {
              current = [];
            }
          }
        }
      }
      this.props.onChange(current);
    },

    /// inputchanged
    /// Triggered when the user text is changed. Building the auto-select box
    inputchanged: function(e) {
     var inp = e.target;
      var textInputValue = inp.value.trim();
      var tagsContainer = inp.parentElement.parentElement.querySelector("#tags-wrapper");
      var sel = inp.parentElement.querySelector("#tagsAutoCompleteSelect");

      var optionsAreVisible = false;
      var currentTags = this.gettags();
      
      var options = Array.from(sel.options);
      for(var i=0; i < options.length; i++)
      {
        var opt = options[i];
        var visible = ((opt.text.toLowerCase().indexOf(textInputValue) >= 0) && (currentTags.indexOf(opt.text) < 0));
        if(visible)
        {
          opt.style.display = "block";
          if(!optionsAreVisible)
          {
            optionsAreVisible = true;
            opt.setAttribute("selected", "seleted");
            sel.selectedIndex = i;
          }
          else
            opt.removeAttribute("selected");
        }
        else
        {
          opt.style.display = "none";
          opt.removeAttribute("selected");
        }
      }
      sel.style.display = (textInputValue && optionsAreVisible)? "block": "none";

      if(textInputValue.indexOf(",") >= 0)
      {
        var caughtTags = textInputValue.substring(0, textInputValue.lastIndexOf(",")).split(",");
        var remainingText = textInputValue.substr(textInputValue.lastIndexOf(",")+1);
        var that = this;
        caughtTags.forEach(function(t){ that.addtag(t); });
        e.target.value = remainingText;
      }
    },

    /// inputKeyDown
    /// Triggered when the user presses a key on the textbox
    inputKeyDown: function(e)
    {
      var inp = e.target;
      var sel = inp.parentElement.querySelector("#tagsAutoCompleteSelect");
      var tagsContainer = sel.parentElement.parentElement.querySelector("#tags-wrapper");
      
      e = e || window.event;
      var keyCode = e.keyCode || e.which;

      //Arrow down: go into the select box, if visible
      if(keyCode=='40'){
          var visibleItems = sel.querySelectorAll('option[style*="display: block;"]');
          if(visibleItems.length > 0)
          {
            sel.focus();
            e.preventDefault();
            return false;
          }
      }
      //backspace on the first position of the textbox: remove the last tag from the collection
      else if (keyCode == '8' && inp.selectionStart == 0 && tagsContainer.children.length > 0){ 

        var lastTag = tagsContainer.lastElementChild;
        var lastTagText = lastTag.querySelector(".tagText").innerText;
        this.removetag(lastTagText);
      }
      //Escape: Hide the select box, if visible
      else if(keyCode == '27')
      {
        if(sel.style.display == "block")
        {
          sel.style.display = "none";
        }
      }
      //Enter: Add the currently typed tag, if any, and hide the select box, if visible
      else if(keyCode == '13')
      {
        this.addtag(inp.value);
        inp.value = "";
        if(sel.style.display == "block")
        {
          sel.style.display = "none";
        }            
      }
    },

    /// closeTag
    /// Triggered when the user clicks the [x] button on a tag
    closeTag: function(e)
    {
      var tag = e.target.parentElement;
      var tagText = tag.querySelector(".tagText").innerText;
      this.removetag(tagText);
    },

    /// selectKeyDown
    /// Triggered when the user hits a key on the select box
    selectKeyDown: function(e)
    {
      var sel = e.target;
      var inp = sel.parentElement.querySelector("#tagsinputunpug");
      e = e || window.event;
      var keyCode = e.keyCode || e.which;
      
      //Enter: Add the currently selected tag, if any, and hide the select box, if visible
      if(keyCode == 13 && sel.selectedIndex >= 0)
      {
        var value = sel.options[sel.selectedIndex].text;
        inp.value = "";
        sel.style.display = "none";
        inp.focus();
        this.addtag(value);
      }
      //Arrow up: If the selected option is the topmost visible one, go to the textbox
      else if (keyCode == 38)
      {
        if(sel.options[sel.selectedIndex].value == sel.querySelectorAll('option[style*="display: block;"]')[0].value)
        {
          inp.focus();
          this.moveCursorToEnd(inp);
          e.preventDefault();
          return false;              
        }
      }
      //Escape: Go to the textbox and hide the select box
      else if (keyCode == 27)
      {
        console.log("...focusing (esc)");
        inp.focus();
        this.moveCursorToEnd(inp);
        sel.style.display = "none";
      }
    },

    /// selectDoubleClick
    /// Triggered whenthe user double clicks the select box
    selectDoubleClick: function(e)
    {
      var sel = e.target;
      if(sel.nodeName == "OPTION")
        sel = sel.parentElement;
      var inp = sel.parentElement.querySelector("#tagsinputunpug");
      e = e || window.event;

      //Add the currently double-clicked tag, if any, and hide the select box, if visible
      if(sel.selectedIndex >= 0)
      {
        var value = sel.options[sel.selectedIndex].text;
        inp.value = "";
        sel.style.display = "none";
        inp.focus();
        this.addtag(value);
      }
    },

    /// moveCursorToEnd
    /// Moves the text cursor to the end of the textbox's text
    moveCursorToEnd: function(inp)
    {
      if (inp.createTextRange) {  
        //IE  
        var FieldRange = inp.createTextRange();  
        FieldRange.moveStart('character', inp.value.length);  
        FieldRange.collapse();  
        FieldRange.select();  
      }  
      else {  
        //Firefox and Opera  
        inp.focus();  
        var length = inp.value.length;  
        inp.setSelectionRange(length, length);  
      } 
    },

    /// focusOnInput
    /// Triggered when the user focuses on the entire tags control. Directs the focus to the textbox.
    focusOnInput: function(e)
    {
      var wrapper = e.target;
      var input = wrapper.querySelector("#tagsinputunpug");
      if(input)
      {
        input.focus();
      }
    },
    
    /// render
    /// Renders the control with all the tags selected
    render: function() {
      var value = this.gettags();
      
      if(value)
      {
        var tags = value;
        var tagsarr = [];
        var that = this;
        for(var i=0; i < tags.length; i++)
        {
          tag = tags[i];
          tagsarr.push(
            h('tag', {},
              h('span', { 'className': 'close', 'onClick': this.closeTag }, 'x'),
              h('span', { 'className': 'tagText' }, tag.trim())
            )
          );
        }
      }
      var siteTagsList = [];
      site_tags.forEach(function(t){
        if(t)
        {
          siteTagsList.push(h('option', { 'value': t }, t));
        }
      });

      var ctl = h('div', { 'className': 'tagwrapper', 'onClick': this.focusOnInput }, 
        h('span', { 'id': 'tags-wrapper' }, tagsarr),
        h('span', { 'className': 'tagsInputWrapper' },
          h('input', { 'type': 'text', 'onInput': this.inputchanged, 'onKeyDown': this.inputKeyDown, 'id': 'tagsinputunpug', 'autocomplete':'off' }),
          h('select', { 'id': 'tagsAutoCompleteSelect', 'size': 6, 'className': 'tagsAutoCompleteSelect', 'onKeyDown': this.selectKeyDown, 'autocomplete':'off', 'onDoubleClick': this.selectDoubleClick }, siteTagsList)
        )
      );
      return ctl;
    }
  });


  var tagsrPreview = createClass({
    render: function() {
      return h('div', { "style" : { "backgroundColor" : this.props.value } } );
    }
  });

function RegisterTagPicker()
{
  if(CMS && CMS.registerWidget)
    CMS.registerWidget('tag-picker', tagsControl, tagsrPreview);
}