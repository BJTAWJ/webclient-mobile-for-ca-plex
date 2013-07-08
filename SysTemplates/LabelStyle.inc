/(!--
Allows the label style to set.  
By default the labels will display to the left, and take up 40% of the width.

The labels can be defined system-wide by setting the labelAlign and labelWidth
properties in the WebClient.properties file, e.g.
	Define.labelAlign=top
	Define.labelWidth=100%

Alternatively, the styles can be overridden by setting the control name parameters of the input control, e.g.
	MyCombo:MainArea:label=My Combo:labelAlign=left:labelWidth=30%
)
/(!If:/(!Param:align))
	labelAlign: "/(!Param:align)",
	/(!If:/(!Param:align)=top)
		labelWidth: "100%",
	/(!Else)
		/(!If:/(!Param:width))
			labelWidth: "/(!Param:width)",
		/(!Else)
			labelWidth: "40%",
		/(!If)
	/(!If)
/(!Else)
	/(!If:/(!IsDefined:labelAlign))
		labelAlign: /(labelAlign),
		labelWidth: /(labelWidth),
	/(!Else)
		labelAlign: "left",
		labelWidth: "40%",
	/(!If)
/(!If)