#!/usr/bin/env python3
"""
Template Configuration System

This module defines the mapping between JSON data structure and PowerPoint template elements.
It provides a flexible way to configure how data is mapped to slides, placeholders, and content types.

Author: AI Assistant
Date: 2024
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum


class ContentType(Enum):
    """Enumeration of supported content types."""
    TEXT = "text"
    BULLET_LIST = "bullet_list"
    TABLE = "table"
    IMAGE = "image"
    TITLE = "title"
    SUBTITLE = "subtitle"


@dataclass
class PlaceholderMapping:
    """Configuration for a single placeholder mapping."""
    placeholder_index: int
    content_type: ContentType
    json_path: str  # Path to data in JSON (e.g., "presentation_data.title_slide.title")
    jinja_enabled: bool = True
    formatting_options: Optional[Dict[str, Any]] = None


@dataclass
class SlideConfig:
    """Configuration for a single slide."""
    slide_key: str  # Key in JSON data
    layout_index: int  # PowerPoint layout index
    placeholders: List[PlaceholderMapping]
    slide_title_path: Optional[str] = None  # Path to slide title in JSON


class TemplateConfig:
    """Main configuration class for template processing."""
    
    def __init__(self):
        self.slides_config = self._create_default_config()
    
    def _create_default_config(self) -> List[SlideConfig]:
        """
        Create default configuration for the sustainable urban farming presentation.
        
        Returns:
            List of slide configurations
        """
        return [
            # Title Slide Configuration
            SlideConfig(
                slide_key="title_slide",
                layout_index=0,  # Title slide layout
                placeholders=[
                    PlaceholderMapping(
                        placeholder_index=0,  # Title placeholder
                        content_type=ContentType.TITLE,
                        json_path="presentation_data.title_slide.title"
                    ),
                    PlaceholderMapping(
                        placeholder_index=1,  # Subtitle placeholder
                        content_type=ContentType.SUBTITLE,
                        json_path="presentation_data.title_slide.subtitle"
                    )
                ],
                slide_title_path="presentation_data.title_slide.title"
            ),
            
            # Benefits Slide Configuration
            SlideConfig(
                slide_key="benefits_slide",
                layout_index=1,  # Content slide layout
                placeholders=[
                    PlaceholderMapping(
                        placeholder_index=0,  # Title placeholder
                        content_type=ContentType.TITLE,
                        json_path="presentation_data.benefits_slide.slide_title"
                    ),
                    PlaceholderMapping(
                        placeholder_index=1,  # Content placeholder
                        content_type=ContentType.BULLET_LIST,
                        json_path="presentation_data.benefits_slide.text_body"
                    ),
                    PlaceholderMapping(
                        placeholder_index=2,  # Image placeholder (if available)
                        content_type=ContentType.IMAGE,
                        json_path="presentation_data.benefits_slide.image_description"
                    )
                ],
                slide_title_path="presentation_data.benefits_slide.slide_title"
            ),
            
            # Impact Slide Configuration
            SlideConfig(
                slide_key="impact_slide",
                layout_index=1,  # Content slide layout
                placeholders=[
                    PlaceholderMapping(
                        placeholder_index=0,  # Title placeholder
                        content_type=ContentType.TITLE,
                        json_path="presentation_data.impact_slide.slide_title"
                    ),
                    PlaceholderMapping(
                        placeholder_index=1,  # Content placeholder
                        content_type=ContentType.TABLE,
                        json_path="presentation_data.impact_slide.table_data"
                    )
                ],
                slide_title_path="presentation_data.impact_slide.slide_title"
            )
        ]
    
    def get_slide_config(self, slide_key: str) -> Optional[SlideConfig]:
        """
        Get configuration for a specific slide.
        
        Args:
            slide_key: Key identifying the slide
            
        Returns:
            SlideConfig object or None if not found
        """
        for config in self.slides_config:
            if config.slide_key == slide_key:
                return config
        return None
    
    def get_all_slide_keys(self) -> List[str]:
        """
        Get all configured slide keys.
        
        Returns:
            List of slide keys
        """
        return [config.slide_key for config in self.slides_config]
    
    def add_slide_config(self, config: SlideConfig):
        """
        Add a new slide configuration.
        
        Args:
            config: SlideConfig object to add
        """
        self.slides_config.append(config)
    
    def update_slide_config(self, slide_key: str, config: SlideConfig):
        """
        Update an existing slide configuration.
        
        Args:
            slide_key: Key of the slide to update
            config: New SlideConfig object
        """
        for i, existing_config in enumerate(self.slides_config):
            if existing_config.slide_key == slide_key:
                self.slides_config[i] = config
                return
        # If not found, add as new
        self.add_slide_config(config)
    
    def get_json_value_by_path(self, data: Dict[str, Any], json_path: str) -> Any:
        """
        Get value from nested dictionary using dot notation path.
        
        Args:
            data: Dictionary containing the data
            json_path: Dot-separated path (e.g., "presentation_data.title_slide.title")
            
        Returns:
            Value at the specified path or None if not found
        """
        try:
            keys = json_path.split('.')
            value = data
            for key in keys:
                value = value[key]
            return value
        except (KeyError, TypeError):
            return None
    
    def validate_data_structure(self, data: Dict[str, Any]) -> List[str]:
        """
        Validate that the provided data matches the expected structure.
        
        Args:
            data: Dictionary containing presentation data
            
        Returns:
            List of validation error messages (empty if valid)
        """
        errors = []
        
        for slide_config in self.slides_config:
            # Check if slide data exists
            slide_data = self.get_json_value_by_path(data, f"presentation_data.{slide_config.slide_key}")
            if slide_data is None:
                errors.append(f"Missing slide data for: {slide_config.slide_key}")
                continue
            
            # Check each placeholder mapping
            for placeholder in slide_config.placeholders:
                value = self.get_json_value_by_path(data, placeholder.json_path)
                if value is None:
                    errors.append(f"Missing data for path: {placeholder.json_path}")
                elif placeholder.content_type == ContentType.TABLE and not isinstance(value, list):
                    errors.append(f"Table data must be a list: {placeholder.json_path}")
                elif placeholder.content_type == ContentType.BULLET_LIST and not isinstance(value, list):
                    errors.append(f"Bullet list data must be a list: {placeholder.json_path}")
        
        return errors


# Global configuration instance
DEFAULT_CONFIG = TemplateConfig()


def get_default_config() -> TemplateConfig:
    """
    Get the default template configuration.
    
    Returns:
        Default TemplateConfig instance
    """
    return DEFAULT_CONFIG


def create_custom_config() -> TemplateConfig:
    """
    Create a new custom template configuration.
    
    Returns:
        New TemplateConfig instance
    """
    return TemplateConfig()