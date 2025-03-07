import {isURLEnabled, isURLMatched, isPDF, isFullyQualifiedDomain, getURLHostOrProtocol, getAbsoluteURL} from '../../../src/utils/url';
import type {UserSettings} from '../../../src/definitions';
import {isIPV6} from '../../../src/utils/ipv6';

it('URL is enabled', () => {
    // Not invert listed
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['mail.google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['mail.google.*'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['mail.google.*/mail'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com/maps'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);

    // Invert listed only
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.*/mail'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteList: ['google.com/maps'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);

    // Special URLs
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteList: ['chrome.google.com'], siteListEnabled: [], applyToListedOnly: false, enableForProtectedPages: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteList: ['chrome.google.com'], siteListEnabled: [], applyToListedOnly: true, enableForProtectedPages: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false, enableForProtectedPages: false} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteList: ['chrome.google.com'], siteListEnabled: [], applyToListedOnly: false, enableForProtectedPages: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://microsoftedge.microsoft.com/addons',
        {siteList: ['microsoftedge.microsoft.com'], siteListEnabled: [], applyToListedOnly: false, enableForProtectedPages: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://microsoftedge.microsoft.com/addons',
        {siteList: ['microsoftedge.microsoft.com'], siteListEnabled: [], applyToListedOnly: true, enableForProtectedPages: true} as UserSettings,
        {isProtected: true, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://duckduckgo.com',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false, enableForProtectedPages: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {enableForPDF: false, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf/resource',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf/resource',
        {enableForPDF: true, siteList: ['darkreader.org'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/very/good/hidden/folder/pdf#file.pdf',
        {enableForPDF: true, siteList: ['https://www.google.com/very/good/hidden/folder/pdf#file.pdf'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://leetcode.com/problems/two-sum/',
        {enableForPDF: false, siteList: ['leetcode.com/problems/'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://leetcode.com/problemset/all/',
        {enableForPDF: false, siteList: ['leetcode.com/problems/'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);

    // Dark theme detection
    expect(isURLEnabled(
        'https://github.com/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false, detectDarkTheme: true} as UserSettings,
        {isProtected: false, isInDarkList: false, isDarkThemeDetected: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://github.com/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false, detectDarkTheme: false} as UserSettings,
        {isProtected: false, isInDarkList: false, isDarkThemeDetected: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://github.com/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false, detectDarkTheme: true} as UserSettings,
        {isProtected: false, isInDarkList: false, isDarkThemeDetected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://github.com/',
        {siteList: [], siteListEnabled: ['github.com'], applyToListedOnly: false, detectDarkTheme: true} as UserSettings,
        {isProtected: false, isInDarkList: false, isDarkThemeDetected: true},
    )).toBe(true);

    // Test for PDF enabling
    expect(isPDF(
        'https://www.google.com/file.pdf'
    )).toBe(true);
    expect(isPDF(
        'https://www.google.com/file.pdf?id=2'
    )).toBe(true);
    expect(isPDF(
        'https://www.google.com/file.pdf/resource'
    )).toBe(false);
    expect(isPDF(
        'https://www.google.com/resource?file=file.pdf'
    )).toBe(false);
    expect(isPDF(
        'https://www.google.com/very/good/hidden/folder/pdf#file.pdf'
    )).toBe(false);
    expect(isPDF(
        'https://fi.wikipedia.org/wiki/Tiedosto:ExtIPA_chart_(2015).pdf?uselang=en'
    )).toBe(false);
    expect(isPDF(
        'https://commons.wikimedia.org/wiki/File:ExtIPA_chart_(2015).pdf'
    )).toBe(false);
    expect(isPDF(
        'https://upload.wikimedia.org/wikipedia/commons/5/56/ExtIPA_chart_(2015).pdf'
    )).toBe(true);

    // IPV6 Testing
    expect(isURLEnabled(
        '[::1]:1337',
        {siteList: ['google.com'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteList: ['[::1]:8080'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteList: ['[::1]:8081'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteList: ['[::1]:8081'], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[::1]:17',
        {siteList: ['[::1]'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[2001:4860:4860::8888]',
        {siteList: ['[2001:4860:4860::8888]'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8844]',
        {siteList: ['[2001:4860:4860::8844]'], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8844]',
        {siteList: [], siteListEnabled: [], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toEqual(false);

    // Default URL matches everything
    expect(isURLMatched('http://example.com', '*')).toEqual(true);
    expect(isURLMatched('https://example.com', '*')).toEqual(true);
    expect(isURLMatched('file:///c/some_file.pdf', '*')).toEqual(true);
    expect(isURLMatched('chrome://settings', '*')).toEqual(true);
    expect(isURLMatched('chrome-extension://settings', '*')).toEqual(true);
    expect(isURLMatched('edge://settings', '*')).toEqual(true);
    expect(isURLMatched('brave://settings', '*')).toEqual(true);
    expect(isURLMatched('kiwi://settings', '*')).toEqual(true);
    expect(isURLMatched('about:blank', '*')).toEqual(true);
    expect(isURLMatched('about:preferences', '*')).toEqual(true);
    // TODO: fix isURLMatched and uncomment me
    // expect(isURLMatched('[::1]', '*')).toEqual(true);
    // expect(isURLMatched('[::1]:80', '*')).toEqual(true);
    expect(isURLMatched('127.0.0.1', '*')).toEqual(true);
    expect(isURLMatched('127.0.0.1:80', '*')).toEqual(true);
    expect(isURLMatched('localhost', '*')).toEqual(true);

    // Some URLs can have unescaped [] in query
    expect(isURLMatched(
        'google.co.uk/order.php?bar=[foo]',
        'google.co.uk',
    )).toEqual(true);
    expect(isURLMatched(
        '[2001:4860:4860::8844]/order.php?bar=foo',
        '[2001:4860:4860::8844]',
    )).toEqual(true);
    expect(isURLMatched(
        '[2001:4860:4860::8844]/order.php?bar=[foo]',
        '[2001:4860:4860::8844]',
    )).toEqual(true);
    expect(isURLMatched(
        'google.co.uk/order.php?bar=[foo]',
        '[2001:4860:4860::8844]',
    )).toEqual(false);
    expect(isIPV6('file:///C:/[/test.html')).toEqual(false);
    expect(isIPV6('file:///C:/[/test.html]')).toEqual(false);
    expect(isIPV6('[2001:4860:4860::8844]')).toEqual(true);

    // Temporary Dark Sites list fix
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: [], siteListEnabled: ['darkreader.org'], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteList: [], siteListEnabled: [], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://google.com/',
        {siteList: [], siteListEnabled: ['darkreader.org'], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://netflix.com',
        {enableForPDF: true, siteList: [''], siteListEnabled: ['netflix.com'], applyToListedOnly: true} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://netflix.com',
        {enableForPDF: true, siteList: [''], siteListEnabled: ['netflix.com'], applyToListedOnly: false} as UserSettings,
        {isProtected: false, isInDarkList: true},
    )).toBe(true);
});

it('Get URL host or protocol', () => {
    expect(getURLHostOrProtocol('https://www.google.com')).toBe('www.google.com');
    expect(getURLHostOrProtocol('https://www.google.com/maps')).toBe('www.google.com');
    expect(getURLHostOrProtocol('http://localhost:8080')).toBe('localhost:8080');
    expect(getURLHostOrProtocol('about:blank')).toBe('about:');
    expect(getURLHostOrProtocol('http://user:pass@www.example.org')).toBe('www.example.org');
    expect(getURLHostOrProtocol('data:text/html,<html>Hello</html>')).toBe('data:');
    expect(getURLHostOrProtocol('file:///Users/index.html')).toBe('/Users/index.html');
});

it('Absolute URL', () => {
    expect(getAbsoluteURL('https://www.google.com', 'image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', '/image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path', '/image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('//www.google.com', '/image.jpg')).toBe(`${location.protocol}//www.google.com/image.jpg`);
    expect(getAbsoluteURL('https://www.google.com', 'image.jpg?size=128')).toBe('https://www.google.com/image.jpg?size=128');
    expect(getAbsoluteURL('https://www.google.com/path', 'image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/', 'image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/long/path', '../image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/long/path/', '../image.jpg')).toBe('https://www.google.com/long/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/long/path/', '../another/image.jpg')).toBe('https://www.google.com/long/another/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', 'image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', '/image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', '//www.google.com/path/image.jpg')).toBe(`${location.protocol}//www.google.com/path/image.jpg`);
    expect(getAbsoluteURL('https://www.google.com', 'https://www.google.com/path/image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', 'https://www.google.com/path/../another/image.jpg')).toBe('https://www.google.com/another/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', 'image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', '../image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('path/index.html', 'image.jpg')).toBe(`${location.origin}/path/image.jpg`);
    expect(getAbsoluteURL('path/index.html', '/image.jpg?size=128')).toBe(`${location.origin}/image.jpg?size=128`);
});

it('Fully qualified domain', () => {
    expect(isFullyQualifiedDomain('www.google.com')).toBe(true);
    expect(isFullyQualifiedDomain('*.google.com')).toBe(false);
});
