// New gruff graph type added to enable sideways stacking bar charts 
// (basically looks like a x/y flip of a standard stacking bar chart)
//
// alun.eyre@googlemail.com

Bluff.SideStackedBar = new JS.Class(Bluff.SideBar, {
  include: Bluff.Base.StackedMixin,
  
  // Spacing factor applied between bars
  bar_spacing: 0.9,
  
  draw: function() {
    this.has_left_labels = true;
    this._get_maximum_by_stack();
    this.callSuper();
    
    if (!this._has_data) return;
    
    this._bar_width = this._graph_height / this._column_count;
    var height = Bluff.array_new(this._column_count, 0),
        length = Bluff.array_new(this._column_count, this._graph_left),
        padding = (this._bar_width * (1 - this.bar_spacing)) / 2;

    Bluff.each(this._norm_data, function(data_row, row_index) {
      this._d.fill = data_row[this.klass.DATA_COLOR_INDEX];
      var raw_data = this._data[row_index][this.klass.DATA_VALUES_INDEX];
      
      Bluff.each(data_row[this.klass.DATA_VALUES_INDEX], function(data_point, point_index) {
        
    	  // using the original calcs from the stacked bar chart to get the difference between
    	  // part of the bart chart we wish to stack.
    	  var temp1 = this._graph_left + (this._graph_width -
                                            data_point * this._graph_width - 
                                            height[point_index]) + 1;
    	  var temp2 = this._graph_left + this._graph_width - height[point_index] - 1;
    	  var difference = temp2 - temp1;
        
    	  var left_x = length[point_index], //+ 1
            left_y = this._graph_top + (this._bar_width * point_index) + padding,
    	      right_x = left_x + difference,
            right_y = left_y + this._bar_width * this.bar_spacing;
    	  length[point_index] += difference;
        height[point_index] += (data_point * this._graph_width - 2);
        
        this._d.rectangle(left_x, left_y, right_x, right_y);
        
        this._draw_tooltip(left_x, left_y,
                           right_x - left_x, right_y - left_y,
                           data_row[this.klass.DATA_LABEL_INDEX],
                           data_row[this.klass.DATA_COLOR_INDEX],
                           raw_data[point_index],
                           point_index,
                           this.tooltips_renderer);
        
        // Calculate center based on bar_width and current row
        var label_center = this._graph_top + (this._bar_width * point_index) + (this._bar_width * this.bar_spacing / 2.0);
        this._draw_label(label_center, point_index);
      }, this);
    }, this);
  },
  
  _larger_than_max: function(data_point, index) {
    index = index || 0;
    return this._max(data_point, index) > this.maximum_value;
  },
  
  _max: function(data_point, index) {
    var sum = 0;
    Bluff.each(this._data, function(item) {
      sum += item[this.klass.DATA_VALUES_INDEX][index];
    }, this);
    return sum;
  }
});

