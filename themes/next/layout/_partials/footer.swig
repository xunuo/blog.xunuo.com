{#<div class="copyright">#}
  {#{% set current = date(Date.now(), "YYYY") %}#}
  {#&copy; &nbsp; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}#}
  {#{{ current }}#}
  {#<span class="author">{{ config.author }}</span>#}
{#</div>#}


{% block footer %}


<a href="https://github.com/xunuo">My Github</a> | <a href="atom.xml">RSS</a>

{% endblock %}
