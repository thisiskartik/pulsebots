from bs4 import BeautifulSoup
from langchain_community.document_loaders import WebBaseLoader
from urllib.parse import urlparse
from urllib.request import urlopen


def get_webpages_documents(links, splitter):
    docs = []
    for link in links:
        loader = WebBaseLoader(link)
        docs += loader.load_and_split(splitter)
    return docs


def trailing_slash(link):
    if link[-1] == '/':
        link = link[:-1]
    return link


def get_website_links(link, urls):
    link = trailing_slash(link)
    urls.add(link)

    loc = urlparse(link).netloc
    base_path = urlparse(link).path

    response = urlopen(link)
    soup = BeautifulSoup(response, 'html.parser')
    for nested_link_tag in soup.find_all('a', href=True):
        nested_link = nested_link_tag['href']
        if urlparse(nested_link).netloc in [loc, ''] and \
                urlparse(nested_link).path.startswith(base_path):
            if urlparse(nested_link).netloc == '':
                nested_link = loc + nested_link
            if urlparse(nested_link).scheme == '':
                nested_link = urlparse(link).scheme + '://' + nested_link
            if nested_link[-1] == '/':
                nested_link = nested_link[:-1]
            if nested_link not in urls:
                urls.add(nested_link)
                get_website_links(link, urls)


def get_website_documents(link, splitter):
    urls = set()
    get_website_links(link, urls)
    return get_webpages_documents(urls, splitter)
