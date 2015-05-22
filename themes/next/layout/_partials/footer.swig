{#<div class="copyright">#}
  {#{% set current = date(Date.now(), "YYYY") %}#}
  {#&copy; &nbsp; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}#}
  {#{{ current }}#}
  {#<span class="author">{{ config.author }}</span>#}
{#</div>#}

<!--
<div class="powered-by">
  {{ __('footer.powered', '<a class="theme-link" href="http://hexo.io">Hexo</a>') }}
</div>

<div class="theme-info">
  {{ __('footer.theme') }} -
  <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next">
    NexT{% if theme.scheme %}.{{ theme.scheme }}{% endif %}
  </a>
</div>
-->

{% block footer %}


<a href="https://github.com/xunuo">My Github</a> | <a href="atom.xml">SSL</a>

{% endblock %}
