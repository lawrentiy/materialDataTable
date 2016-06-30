//Don`t forget for SimpleSchema and MMR
//SimpleSchema.extendOptions({
//    MMR: Match.Optional(Object)
//});


/* How to render different types of fields in table */
const defaultRender = (column, record) => {
    const v = getDescendantProp(record, column.field);
    //console.log(column.field, column, record, v);
    if (v === undefined)
        return '';
    else if (column.type === Object) { // if object, just convert it to json-string
        return JSON.stringify(v);
    }
    else if (column.type === Boolean) // if value is boolean, show as checkbox
        return <UI.Checkbox checked={v} disabled={true} />;
    else if (column.type === Array) {// if type is array, show as checkbox
        const fname = column.showAtTable ? column.showAtTable[0] : 0; // by name or by
        return (v.map(v => v[fname])).join(', '); // try to get fields from all objects in array
    }
    else // default as string
    {
        return v;
    }
};

const getDescendantProp =(obj, desc) => {
    const arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
};

let getSimpleSchemaFromCollection = (collection) => {
    if (!collection) throw new Error('Collection in props is required');
    if (!collection._c2) throw new Error('Can`t find collection._c2');
    if (!collection._c2._simpleSchema) throw new Error('Can`t find collection._c2._simpleSchema');
    if (!collection._c2._simpleSchema._schema) throw new Error('Can`t find collection._c2._simpleSchema._schema');
    return collection._c2._simpleSchema._schema;
};

const generateColumnsList = (collection, generateTitle) => {
    const schema = getSimpleSchemaFromCollection(collection);
    const columns = [];
    const cachedFields = [];
    if (schema) {
        for (let f in schema) {
            const column = schema[f];
            const { MMR ={} } = column;
            const { table } = MMR;
            // If field is object, and table have to show some fields from that object
            if (column.type == Object && table && _.isArray(table.columns)) {
                table.columns.map( v => {cachedFields.push(f+'.'+v)} );
                continue;
            }
            // If SimpleSchema object hasn`t table field and that field doesn`t set in fields list for child object
            if (!table && (cachedFields.indexOf(f) === -1)) continue;

            columns.push(_.defaults({
                showAtTable: table ? table.columns : undefined,
                title: generateTitle(f), //Get field title from t9n object
                render: table && table.render ? table.render : defaultRender, //set render method of field
            }, schema[f], {field: f}));
        }
    }
    return columns;
};

export {
    defaultRender, getDescendantProp, getSimpleSchemaFromCollection, generateColumnsList
}