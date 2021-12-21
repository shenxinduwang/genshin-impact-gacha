//保存文件模块；
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import {
    mate
} from './method'
const save = (DataObj) => {
    // console.log(DataObj);
    const workbook = new ExcelJS.Workbook();
    for (const key in DataObj) {
        if (Object.hasOwnProperty.call(DataObj, key)) {
            const element = DataObj[key];
            console.log(key, mate(key));
            const sheet = workbook.addWorksheet(mate(key), {
                views: [{
                    state: "frozen",
                    ySplit: 1
                }],
            });
            //表头
            sheet.columns = [{
                header: "时间",
                key: "time",
                width: 24
            }, {
                header: "名称",
                key: "name",
                width: 14
            }, {
                header: "类别",
                key: "type",
                width: 8
            }, {
                header: "星级",
                key: "rank",
                width: 8
            }, {
                header: "总次数",
                key: "idx",
                width: 8
            }, {
                header: "保底内",
                key: "pdx",
                width: 8
            }, ];
            sheet.addRows(element);
            // console.log(element);
            // set xlsx hearer style
            ["A", "B", "C", "D", "E", "F"].forEach((v) => {
                sheet.getCell(`${v}1`).border = {
                    top: {
                        style: "thin",
                        color: {
                            argb: "ffc4c2bf"
                        }
                    },
                    left: {
                        style: "thin",
                        color: {
                            argb: "ffc4c2bf"
                        }
                    },
                    bottom: {
                        style: "thin",
                        color: {
                            argb: "ffc4c2bf"
                        }
                    },
                    right: {
                        style: "thin",
                        color: {
                            argb: "ffc4c2bf"
                        }
                    },
                };
                sheet.getCell(`${v}1`).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "ffdbd7d3"
                    },
                };
                sheet.getCell(`${v}1`).font = {
                    name: "微软雅黑",
                    color: {
                        argb: "ff757575"
                    },
                    bold: true,
                };
            });
            // set xlsx cell style
            element.forEach((v, i) => {
                ["A", "B", "C", "D", "E", "F"].forEach((c) => {
                    sheet.getCell(`${c}${i + 2}`).border = {
                        top: {
                            style: "thin",
                            color: {
                                argb: "ffc4c2bf"
                            }
                        },
                        left: {
                            style: "thin",
                            color: {
                                argb: "ffc4c2bf"
                            }
                        },
                        bottom: {
                            style: "thin",
                            color: {
                                argb: "ffc4c2bf"
                            }
                        },
                        right: {
                            style: "thin",
                            color: {
                                argb: "ffc4c2bf"
                            }
                        },
                    };
                    sheet.getCell(`${c}${i + 2}`).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {
                            argb: "ffebebeb"
                        },
                    };
                    // rare rank background color
                    const rankColor = {
                        3: "ff8e8e8e",
                        4: "ffa256e1",
                        5: "ffbd6932",
                    };
                    sheet.getCell(`${c}${i + 2}`).font = {
                        name: "微软雅黑",
                        color: {
                            argb: rankColor[v[3]]
                        },
                        bold: v[3] != "3",
                    };
                });
            });
        }

    }
    const timestamp = new Date().getTime();
    const fileName = `原神抽卡记录导出_${timestamp}.xlsx`;
    workbook.xlsx.writeBuffer().then((buffer) => {
        FileSaver(
            new Blob([buffer], {
                type: 'application/octet-stream'
            }),
            fileName + '.' + 'xlsx'
        );
    });
}
export {
    save
}