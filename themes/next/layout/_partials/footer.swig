{#<div class="copyright">#}
  {#{% set current = date(Date.now(), "YYYY") %}#}
  {#&copy; &nbsp; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}#}
  {#{{ current }}#}
  {#<span class="author">{{ config.author }}</span>#}
{#</div>#}


{% block footer %}


<a href="https://github.com/xunuo">My Github</a> | <a href="atom.xml">RSS</a>


<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1255449350'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "w.cnzz.com/q_stat.php%3Fid%3D1255449350' type='text/javascript'%3E%3C/script%3E"));</script>


{% endblock %}
