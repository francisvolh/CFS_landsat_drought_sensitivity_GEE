/*
Agriculture masks from  Canada AAFC Annual Crop Inventory
Alec L. Robitaille


Canada AAFC Annual Crop Inventory

10 	Cloud
20 	Water
30 	Exposed Land and Barren
34 	Urban and Developed
35 	Greenhouses
50 	Shrubland
80 	Wetland
85 	Peatland
110 Grassland
120 Agriculture (undifferentiated)
122 Pasture and Forages
130 Too Wet to be Seeded
131 Fallow
132 Cereals
133 Barley
134 Other Grains
135 Millet
136 Oats
137 Rye
138 Spelt
139 Triticale
140 Wheat
141 Switchgrass
142 Sorghum
143 Quinoa
145 Winter Wheat
146 Spring Wheat
147 Corn
148 Tobacco
149 Ginseng
150 Oilseeds
151 Borage
152 Camelina
153 Canola and Rapeseed
154 Flaxseed
155 Mustard
156 Safflower
157 Sunflower
158 Soybeans
160 Pulses
161 Other Pulses
162 Peas
163 Chickpeas
167 Beans
168 Fababeans
174 Lentils
175 Vegetables
176 Tomatoes
177 Potatoes
178 Sugarbeets
179 Other Vegetables
180 Fruits
181 Berries
182 Blueberry
183 Cranberry
185 Other Berry
188 Orchards
189 Other Fruits
190 Vineyards
191 Hops
192 Sod
193 Herbs
194 Nursery
195 Buckwheat
196 Canaryseed
197 Hemp
198 Vetch
199 Other Crops
200 Forest (undifferentiated)
210 Coniferous
220 Broadleaf
230 Mixedwood


-- Excluded --
> 110 & < 200



*/



var aafc_aci = ee.ImageCollection('AAFC/ACI');
exports.aafc_aci = aafc_aci;



var mask_aci = function(img) {
	return img.updateMask(
		img.gt(110).and(
			img.lt(200)
		)
	);
};
var masked_aci = aafc_aci
	.map(mask_aci)
exports.masked_aci = masked_aci;



var get_agriculture_mask = masked_aci
	.sum()
	.eq(0);
exports.get_agriculture_mask = get_agriculture_mask;

