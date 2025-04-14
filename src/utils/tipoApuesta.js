const tipoApuesta = {
    COLOR: 'COLOR',
    COLOR_PARIDAD: 'COLOR_PAR',
    NUMERO_ESPECIFICO: 'NUMERO'
}
const multiplicadores = {
    [tipoApuesta.NUMERO_ESPECIFICO]: 3,
    [tipoApuesta.COLOR]: 0.5,
    [tipoApuesta.COLOR_PARIDAD]: 2
}
export { tipoApuesta, multiplicadores }