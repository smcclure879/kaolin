function listGetAt (list, position, delimiter)
{
	if (delimiter == null)
		delimiter = ',';
	list = list + delimiter + "BOBOTHECLOWN";

	var list = list.split(delimiter);
	if (list.length > position)
		return list[position];
	else
		return 0;
}

function listFind (list, value, delimiter)
{
	var j = 0;
	var listLocation = -1;

	if (delimiter == null)
		delimiter = ',';

	list = "BOBOTHECLOWN" + delimiter + list;
	var listList = list.split(delimiter);
	for (j=0; j<listList.length; j=j+1)
	{
	   if (listList[j] == value)
	   	{
		listLocation = j - 1;
		break;
		}
	}

	return listLocation;
}

function listLen (list, delimiter)
{
	var j = 0;

	if (delimiter == null)
		delimiter = ',';

	list = "BOBOTHECLOWN" + delimiter + list;
	var listList = list.split(delimiter);

	return listList.length - 1;
}

function listRemoveValue (list, value, delimiter)
{
	var j = 0;
	var listLocation = -1;
	var newList = "";

	if (delimiter == null)
		delimiter = ',';

	list = "BOBOTHECLOWN" + delimiter + list;
	var listList = list.split(delimiter);
	for (j=0; j<listList.length; j=j+1)
	{
	   if (listList[j] != value && listList[j] != "BOBOTHECLOWN")
	   	{
			if (newList == "")
				newList = listList[j];
			else
				newList += delimiter + listList[j];
		}
	}

	return newList;
}

function ltrim (str, chars)
{
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim (str, chars)
{
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function trim (str, chars)
{
	return ltrim(rtrim(str, chars), chars);
}

function left(str, n)
{
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}

function right(str, n)
{
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}

