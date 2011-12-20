/**
 * Id of search box.
 */
SEARCHBOX_ID = 'search';

/**
 * Id of hidden selected field.
 */
SELECTED_VALUE_BOX_ID = 'selectedValue';

/**
 * Form id.
 */
SEARCH_FORM_ID = 'searchForm';

/**
 * Id of block with suggestions.
 */
SUGGESTIONS_ID = 'suggestions';

/**
 * Bool if send ids.
 */
SEND_IDS = true;

/**
 * Source url.
 */
REQUEST_URL = 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.php?q=';

/**
 * Request method.
 */
REQUEST_METHOD = 'GET';

/**
 * Minimum input length before search.
 */
MINIMUM_INPUT_LENGTH = 3;

/**
 * 
 */	
window.onload = function()
{
	var searchBox = document.getElementById(SEARCHBOX_ID);
	var selectedBox = document.getElementById(SELECTED_VALUE_BOX_ID);
	var searchForm = document.getElementById(SEARCH_FORM_ID);
	new suggestionsControl(searchBox, selectedBox, searchForm);
}

/**
 * @param searchBox
 * @param selectedBox
 * @param searchForm
 * @returns {suggestionsControl}
 */
function suggestionsControl(searchBox, selectedBox, searchForm) {
	this.suggestionsDiv = document.getElementById(SUGGESTIONS_ID);
    this.searchBox = searchBox;
    this.selectedBox = selectedBox;
    this.searchForm = searchForm;
    this.currentSuggestionNumber = -1;
    this.suggestionsNodesList = {};
    this.suggestionsList = {}
    this.init(); 
}

/**
 * Init function.
 */
suggestionsControl.prototype.init = function () 
{
	var This = this;
	
	this.searchBox.onkeyup = function (event) 
	{
		This.handleKeyUp(event);
	};
	
	this.searchForm.onsubmit = function()
	{
		This.handleSubmit();
	}
};

/**
 * Keyup handler.
 * 
 * @param event
 */
suggestionsControl.prototype.handleKeyUp = function (event) 
{
	switch(event.keyCode) {
        case 38: //up arrow
            this.previousSuggestion();
            return;
        case 40: //down arrow 
            this.nextSuggestion();
            return;
        case 13: //enter
            this.selectSuggestion(null);
            return;
        case 27: //esc
            this.hideSuggestions();
            return;
            
        case 8: //backspace. this one should be last, do not return after that
        	if(this.searchBox.value.length <= MINIMUM_INPUT_LENGTH)
    		{
        		this.hideSuggestions();
    		}
        	this.currentSuggestionNumber = -1;
    }
	
	this.search();
};

/**
 * Submit handler.
 */
suggestionsControl.prototype.handleSubmit = function()
{
	if (!SEND_IDS)
	{
		this.selectedBox.value = this.searchBox.value;
	}
	this.searchForm.submit();
}

/**
 * Search method.
 */
suggestionsControl.prototype.search = function () 
{
	var textToSearch = this.searchBox.value;
	if (textToSearch.length < MINIMUM_INPUT_LENGTH)
	{
		return;
	}
	
	this.processRequest(textToSearch);
};

/**
 * Request.
 * @param searchText
 */
suggestionsControl.prototype.processRequest = function(searchText)
{
	var This = this;
	var requestUrl = REQUEST_URL + searchText;
	
	xmlhttp=new XMLHttpRequest();
	xmlhttp.open(REQUEST_METHOD, requestUrl, true);
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4) 
		{
			This.processResponse(xmlhttp.responseText);
		}
	}
	xmlhttp.send(null);
}

/**
 * Response.
 * @param response
 */
suggestionsControl.prototype.processResponse = function(response)
{
	this.clearSuggestions();
	
	var responseObject = eval('(' + response + ')');
	
	for(var i=0; i<responseObject.length; i++)
	{
		this.addSuggestion(responseObject[i], i);
	}
	this.showSuggestions();
}

/**
 * Adds suggestion to list.
 * 
 * @param suggestion
 * @param i
 */
suggestionsControl.prototype.addSuggestion = function(suggestion, i)
{
	This = this;
	var suggestionNode = document.createElement('div');
	suggestionNode.innerHTML = suggestion.shortName;
	suggestionNode.onmouseover = function()
	{
		This.highlightSuggestion(i);
	}
	
	suggestionNode.onmouseout = function()
	{
		This.unHighlightSuggestion(i);
	}
	
	suggestionNode.onclick = function()
	{
		This.selectSuggestion(i);
	}
	
	
	this.suggestionsDiv.appendChild(suggestionNode);
	this.suggestionsNodesList[i] = suggestionNode;
	this.suggestionsList[i] = suggestion;
}

/**
 * Next suggestion.
 */
suggestionsControl.prototype.nextSuggestion = function()
{
	console.log(this.currentSuggestionNumber);
	this.fillForm(this.suggestionsList[this.nextSuggestionNumber()]);
	this.highlightSuggestion(this.nextSuggestionNumber());
}

/**
 * Previous suggestion.
 */
suggestionsControl.prototype.previousSuggestion = function()
{
	this.fillForm(this.suggestionsList[this.previousSuggestionNumber()]);
	this.highlightSuggestion(this.previousSuggestionNumber());
}

/**
 * Getts next suggestion number.
 * 
 * @returns {Number}
 */
suggestionsControl.prototype.nextSuggestionNumber = function()
{
	var suggestionNumber = this.currentSuggestionNumber + 1;
	if (suggestionNumber > this.suggestionsDiv.childNodes.length -1)
	{
		var suggestionNumber = 0;
	}
	if (suggestionNumber < 0)
	{
		var suggestionNumber = this.suggestionsDiv.childNodes.length -1;
	}
	
	return suggestionNumber;
}

/**
 * Getts previous suggestion number
 * @returns {Number}
 */
suggestionsControl.prototype.previousSuggestionNumber = function()
{
	var suggestionNumber = this.currentSuggestionNumber - 1;
	if (suggestionNumber > this.suggestionsDiv.childNodes.length -1)
	{
		var suggestionNumber = 0;
	}
	if (suggestionNumber < 0)
	{
		var suggestionNumber = this.suggestionsDiv.childNodes.length -1;
	}
	
	return suggestionNumber;
}

/**
 * Hides suggestions.
 */
suggestionsControl.prototype.hideSuggestions = function () 
{
	this.suggestionsDiv.style.display = 'none';
	this.currentSuggestionNumber = -1;
};

/**
 * Shows suggestions.
 */
suggestionsControl.prototype.showSuggestions = function () 
{
    this.suggestionsDiv.style.display = 'block';
};

/**
 * Clear suggestions list.
 */
suggestionsControl.prototype.clearSuggestions = function () 
{
    this.suggestionsDiv.innerHTML = '';
};

/**
 * Highlight suggestion.
 * 
 * @param suggestionNumber
 */
suggestionsControl.prototype.highlightSuggestion = function (suggestionNumber) 
{
	
	if (typeof(this.suggestionsDiv.childNodes[this.currentSuggestionNumber]) != 'undefined')
	{
		this.suggestionsDiv.childNodes[this.currentSuggestionNumber].className = '';
	}
	
	this.currentSuggestionNumber = suggestionNumber;
	
	this.suggestionsDiv.childNodes[this.currentSuggestionNumber].className = 'selected';
};

/**
 * Unhighlight suggestion.
 * 
 * @param suggestionNumber
 */
suggestionsControl.prototype.unHighlightSuggestion = function (suggestionNumber)
{
	this.suggestionsDiv.childNodes[suggestionNumber].className = '';
}

/**
 * Select suggestion.
 * 
 * @param suggestionNumber
 */
suggestionsControl.prototype.selectSuggestion = function (suggestionNumber)
{
	if (suggestionNumber === null)
	{
		suggestionNumber = this.currentSuggestionNumber;
	}
	
	this.fillForm(this.suggestionsList[suggestionNumber]);
	this.hideSuggestions();
	this.searchBox.focus();
}

/**
 * Fill form with suggestion value.
 * 
 * @param suggestion
 */
suggestionsControl.prototype.fillForm = function(suggestion)
{
	if (typeof(suggestion.shortName) === 'undefined')
	{
		return;
	}
	
	this.searchBox.value = suggestion.shortName;
	if (SEND_IDS)
	{
		this.selectedBox.value = suggestion.id;
	}
	else
	{
		this.selectedBox.value = suggestion.shortName;
	}
}

