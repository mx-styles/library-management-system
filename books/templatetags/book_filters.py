from django import template

register = template.Library()

@register.filter
def get_item(obj, key):
    """Get an item from an object by key."""
    if hasattr(obj, key):
        return getattr(obj, key)
    elif isinstance(obj, dict):
        return obj.get(key)
    return None
