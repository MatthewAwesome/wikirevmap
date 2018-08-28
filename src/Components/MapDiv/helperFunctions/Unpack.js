export default function Unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}