import json
from xml.etree import ElementTree as ET
import os

def get_slide_dimensions(presentation_xml_file):
    """
    Parses presentation.xml to extract slide dimensions.
    """
    tree = ET.parse(presentation_xml_file)
    root = tree.getroot()
    namespaces = {
        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
    }
    sld_sz = root.find('p:sldSz', namespaces)
    if sld_sz is not None:
        return {
            "width": sld_sz.get('cx'),
            "height": sld_sz.get('cy')
        }
    return {}

def analyze_theme(theme_file, presentation_xml_file, output_file):
    tree = ET.parse(theme_file)
    root = tree.getroot()

    namespaces = {
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'
    }

    color_scheme = {}
    clr_scheme_element = root.find('a:themeElements/a:clrScheme', namespaces)
    if clr_scheme_element is not None:
        for color_element in clr_scheme_element:
            color_name = color_element.tag.split('}')[1]
            srgb_clr = color_element.find('a:srgbClr', namespaces)
            if srgb_clr is not None:
                color_scheme[color_name] = srgb_clr.get('val')
            sys_clr = color_element.find('a:sysClr', namespaces)
            if sys_clr is not None:
                color_scheme[color_name] = sys_clr.get('lastClr')

    font_scheme = {
        'majorFont': {},
        'minorFont': {}
    }
    font_scheme_element = root.find('a:themeElements/a:fontScheme', namespaces)
    if font_scheme_element is not None:
        major_font_element = font_scheme_element.find('a:majorFont', namespaces)
        if major_font_element is not None:
            for font in major_font_element:
                if 'typeface' in font.attrib:
                    if 'script' in font.attrib:
                        font_scheme['majorFont'][font.get('script')] = font.get('typeface')
                    elif font.tag.endswith('latin'):
                        font_scheme['majorFont']['latin'] = font.get('typeface')

        minor_font_element = font_scheme_element.find('a:minorFont', namespaces)
        if minor_font_element is not None:
            for font in minor_font_element:
                if 'typeface' in font.attrib:
                    if 'script' in font.attrib:
                        font_scheme['minorFont'][font.get('script')] = font.get('typeface')
                    elif font.tag.endswith('latin'):
                        font_scheme['minorFont']['latin'] = font.get('typeface')
    
    slide_dimensions = get_slide_dimensions(presentation_xml_file)

    analysis = {
        'color_scheme': color_scheme,
        'font_scheme': font_scheme,
        'slide_dimensions': slide_dimensions
    }

    with open(output_file, 'w') as f:
        json.dump(analysis, f, indent=4)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 2:
        theme_path = sys.argv[1]
        presentation_xml_path = sys.argv[2]
        analyze_theme(theme_path, presentation_xml_path, 'template_analysis.json')
    else:
        print("Usage: python template_analyzer.py <path_to_theme.xml> <path_to_presentation.xml>")