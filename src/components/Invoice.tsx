import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import { OrderDetail } from '@/lib/types/types'
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  diswith: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: 36,
  },
  margintpbt: {
    marginTop: 36,
    marginBottom: 36,
  },
  image: {
    marginVertical: 15,
    width: 100,
    height: 24,
    marginBottom: 36,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
    borderTop: 'none',
  },
  container: {
    backgroundColor: 'white',
    // border: 1,
    border: 'black',
    height: '100%',
  },
  para: {
    fontSize: 10,
  },
  invest: {
    marginRight: 100,
    marginBottom: 12,
    fontSize: 10,
  },
  // table css
  table: {
    width: '100%',
  },
  row: {
    border: '1px solid #4a4a4a',
  },

  row1: {
    width: 101,
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    fontSize: '11px',
  },
  row2: {
    width: 70,
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    fontSize: '11px',
  },
  borderC: {
    borderBottom: '1px solid #4a4a4a',
    fontSize: 10,
    height: 50,
    width: 70,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11,
    paddingHorizontal: 1,
    borderTop: '1px solid #4a4a4a',
    borderLeft: '1px solid #4a4a4a',
    borderRight: '1px solid #4a4a4a',
  },
  rowfl: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 11,
  },
  rowtop: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 11,
  },
  topcol: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11,
  },
  gaprow: {
    marginBottom: 12,
  },
})

const MyDocument = ({
  data,
  paymentDate,
}: {
  data: OrderDetail
  paymentDate: string
}) => (
  <Document>
    <Page size="A4" style={styles.body}>
      <View style={styles.container}>
        <Image style={styles.image} src={'/precize-logo-dark.png'} />
        <View>
          <View style={styles.rowtop}>
            <View style={styles.topcol}>
              <Text style={styles.gaprow}>Order ID :</Text>
              <Text style={styles.gaprow}>Invester Name :</Text>
              <Text style={styles.gaprow}>Bank Name :</Text>
              <Text style={styles.gaprow}>Bank Account Number :</Text>
              <Text style={styles.gaprow}>IFSC :</Text>
              <Text style={styles.gaprow}>DP ID :</Text>
              <Text style={styles.gaprow}>Client ID :</Text>
            </View>
            <View style={styles.topcol}>
              <Text style={styles.gaprow}>{data?.gui_order_id}</Text>
              <Text style={styles.gaprow}>{data?.name} </Text>
              <Text style={styles.gaprow}>
                {data?.bank_details[0]?.bank_name}
              </Text>
              <Text style={styles.gaprow}>
                {data?.bank_details[0]?.account_number}
              </Text>
              <Text style={styles.gaprow}>{data?.bank_details[0]?.ifsc}</Text>
              <Text style={styles.gaprow}>
                {data?.bo_id?.split('').splice(0, 8)}
              </Text>
              <Text style={styles.gaprow}>
                {data?.bo_id?.split('').splice(8, 16)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.margintpbt}>
          <View style={styles.rowfl}>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>Security Name</Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>{data?.symbol}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>Payment Date</Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>
                  {paymentDate?.split('').splice(0, 10)}
                </Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row2}>Quantity</Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row2}>{data?.quantity}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row2}>Price/share</Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row2}>{data?.price}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row2}>Stamp Duty </Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row2}> {data?.stampDuty}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>Transaction fee</Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row1}> {data?.transactionFee}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>Total Amount</Text>
              </Text>
              <Text style={styles.borderC}>
                <Text style={styles.row1}>
                  {Math.round(
                    (+data?.amount +
                      +data?.stampDuty +
                      +data?.transactionFee +
                      Number.EPSILON) *
                      100
                  ) / 100}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.para}>
          This is to bring to your notice that Precize is not an advisor for any
          of the stocks, we are just the facilitators for these transfers.
        </Text>
      </View>
    </Page>
  </Document>
)

function Invoice({
  data,
  paymentDate,
}: {
  data: OrderDetail
  paymentDate: string
}) {
  return (
    <PDFDownloadLink
      document={<MyDocument data={data} paymentDate={paymentDate} />}
      fileName={`Precize_${data.gui_order_id}_${paymentDate}_${data.symbol}.pdf`}
    >
      <Button type="button" variant="outline">
        Download Invoice
      </Button>
    </PDFDownloadLink>
  )
}

export default Invoice
