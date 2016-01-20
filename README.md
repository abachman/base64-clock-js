Itch scratching, on or around 2016-01-20.

What if instead of using numbers for time--e.g., `11:22:38`--we used the Base64
character conversion table to get a three character string version of time?

    11:22:38 -> LWm

Then put it on a web page and make it move.

**NOTE**: this is not actually Base64 encoding, the real Base64 encoded
version of `11:22:38`, or the byte array `[11, 22, 38]` would look like this:

    CxYm

I got that by running the following:

    btoa(String.fromCharCode(11) + String.fromCharCode(22) + String.fromCharCode(38));

in the Javascript console. If you wanted to convert the encoded time back out
of Base64, you could do it like this:

    var time = "CxYm",
        decoded = atob(time),
        time_array = decoded.split('').map(function (c) { return c.charCodeAt(0) });
    console.log("TIME IS", time_array);

resulting in the output:

    TIME IS [11, 22, 38]

