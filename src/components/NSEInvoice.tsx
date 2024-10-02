import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import moment from 'moment'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  firstpage: {
    marginTop: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textcenter: {
    textAlign: 'center',
  },
  margintpbt: {
    marginTop: 36,
    marginBottom: 36,
  },
  marginleft30: {
    marginLeft: '30px',
  },
  marginleft20: {
    marginLeft: '20px',
  },
  container: {
    backgroundColor: 'white',
    border: 1,
    borderColor: 'black',
    height: '100%',
  },
  pagepadding: {
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingTop: '32px',
    paddingBottom: '0px',
    fontSize: '14px',
    height: '100%',
  },
  font14: {
    fontSize: '14px',
  },
  commonmargintopbottom: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  flexcolandmargin: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    marginBottom: '20px',
  },
  marginTop: {
    marginTop: '20px',
  },
  marginBottom: {
    marginBottom: '20px',
  },
  marginBottom16: {
    marginBottom: '16px',
  },
  horizontalline: {
    borderBottom: '1px solid black',
    width: '100%',
    marginBottom: '0px',
  },
  textunderline: {
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  listtext: {
    marginTop: '16px',
    marginLeft: '50px',
  },
  numberlist: {
    marginTop: '10px',
    marginLeft: '40px',
  },
  image: {
    width: 100,
    height: 100,
  },
  flexcol: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px',
  },
  flexdiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginleft95per: {
    marginLeft: '98%',
  },
  firstpagehrline: {
    position: 'absolute',
    borderBottom: '1px solid black',
    width: '100%',
    bottom: '0px',
    left: '32px',
    height: '20px',
    marginTop: '20px',
    paddingTop: '20px',
  },
  secondpagehrline: {
    marginTop: '80px',
    borderBottom: '1px solid black',
    width: '100%',
    marginBottom: '0px',
  },
  sixpagehrline: {
    marginTop: '150px',
    borderBottom: '1px solid black',
    width: '100%',
    marginBottom: '0px',
  },
  sevenpagehrline: {
    marginTop: '300px',
    borderBottom: '1px solid black',
    width: '100%',
    marginBottom: '0px',
  },
  thirdpagehrline: {
    marginTop: '200px',
    borderBottom: '1px solid black',
    width: '100%',
    marginBottom: '0px',
  },
  tablecol: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11,
    paddingHorizontal: 1,
    borderTop: '1px solid #4a4a4a',
    borderLeft: '1px solid #4a4a4a',
    borderRight: '1px solid #4a4a4a',
    borderBottom: '1px solid #4a4a4a',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11,
  },
  tablerowf: {
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    fontSize: 11,
  },
  row1: {
    width: '300px',
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
  },
  seller: {
    paddingVertical: '13px',
    borderBottom: '1px solid black',
    backgroundColor: 'rgb(223,223,223)',
    alignItems: 'center',
    textAlign: 'center',
  },
  contact: {
    paddingVertical: '7px',
    borderBottom: '1px solid black',
    backgroundColor: 'rgb(223,223,223)',
  },
  borderBottom: {
    borderBottom: '1px solid black',
  },
  tablerowf2: {
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    fontSize: 11,
  },
  underlineAndMargin: {
    marginTop: '20px',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  marginTopLeft: {
    marginTop: '20px',
    marginLeft: '20px',
  },
  marginTop10: {
    marginTop: '10px',
  },
  marginbottom20: {
    marginBottom: '20px',
  },
  addresswidth: {
    width: '400px',
  },
  // second table
  secondtable: {
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'row',
    fontSize: 11,
  },
  secondchildtable: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 11,
  },

  tablefrstbox: {
    width: '170px',
    backgroundColor: 'rgb(223,223,223)',
    border: '1px solid black',
  },
  tablefrstchildbox: {
    width: '170px',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
  },
  tablesecbox: {
    width: '250px',
    backgroundColor: 'rgb(223,223,223)',
    borderBottom: '1px solid black',
    borderTop: '1px solid black',
  },
  tablesecchildbox: {
    width: '250px',
    borderBottom: '1px solid black',
    height: 'auto',
  },
  tablethirdbox: {
    width: '200px',
    backgroundColor: 'rgb(223,223,223)',
    border: '1px solid black',
  },
  tablethirdchildbox: {
    width: '200px',
    height: 'auto',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
  },
  buyer: {
    paddingTop: '4px',
    height: '30px',
    textAlign: 'center',
  },
  smallboxes: {
    height: 'auto',
    textAlign: 'center',
    borderBottom: '1px solid black',
  },
  contactheight: {
    height: 'auto',
  },
  marginTop6: {
    marginTop: '6px',
  },
  maxW350: {
    maxWidth: '350px',
    margin: 'auto',
    textAlign: 'center',
  },
  boldFont: {
    fontWeight: 'bold',
    marginBottom: '6px',
  },
})
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.body}>
      <View style={styles.container}>
        <View style={styles.firstpage}>
          <Text>SHARE PURCHASE AGREEMENT</Text>
          <Text style={styles.margintpbt}>Between</Text>

          <Text style={styles.boldFont}>CHACE TECHNOLOGIES PVT LTD.,</Text>
          <Text style={styles.maxW350}>
            547/15, TAPASYA, 1ST FLOOR, A BLOCK, NEAR VI STORE, SAHAKARANAGAR,
            BENGALURU - 560092
          </Text>
          <Text style={styles.margintpbt}>And</Text>
          <Text style={styles.boldFont}>
            {data?.data?.name_as_per_pan?.toUpperCase()}
          </Text>
          <Text style={styles.maxW350}>
            {data?.data?.address_as_per_aadhaar
              ?.replace(/\s/g, ' ')
              .toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text style={styles.textcenter}>SHARE PURCHASE AGREEMENT</Text>
        <Text style={styles.commonmargintopbottom}>
          This Share Purchase Agreement (&quot;Agreement&quot;) is for the sale
          and purchase of shares of the National Stock Exchange of India Limited
          (&quot;NSE&quot; and &quot;NSE Shares&quot; respectively) is made at
          Bangalore on{' '}
          {moment(data?.data?.payment_date).local().format('YYYY-MM-DD')} by and
          between;{' '}
        </Text>
        <Text>BETWEEN:</Text>
        <Text style={styles.commonmargintopbottom}>
          CHACE TECHNOLOGIES PVT LTD, having PAN No. AAJCC6663M and DEMAT
          No.1207650000280573 having an office at 547/15, TAPASYA, 1ST FLOOR, A
          BLOCK, NEAR VI STORE, SAHAKARANAGAR, BENGALURU - 560092 from now on
          referred to as “the Seller”, (which expression shall, unless it is
          repugnant to the context or meaning thereof, be deemed to mean and
          include its successors and assigns) of the First Part;
        </Text>
        <Text style={styles.marginTop}>AND</Text>
        <Text style={styles.commonmargintopbottom}>
          {data?.data?.name_as_per_pan?.toUpperCase()}, having PAN No.{' '}
          {data?.data?.pan?.toUpperCase()},{' '}
          {data?.data?.aadhaar !== null ? 'AADHAAR No. ' : ''}
          {data?.data?.aadhaar ?? ''} and DEMAT No. {data?.data?.bo_id},
          Residing at{' '}
          {data?.data?.address_as_per_aadhaar
            ?.replace(/\s/g, ' ')
            .toUpperCase()}
          , from now on referred to as “the BUYER” (which expression shall,
          unless it is repugnant to the context or meaning thereof, be deemed to
          mean and include its successors and permitted assigns) of the Second
          Part;
        </Text>
        <Text>
          The Seller and the BUYER shall benefit from now on be referred to
          individually as a “Party” and collectively as the “Parties”.
        </Text>
        <View style={styles.flexcolandmargin}>
          <View>
            <Text>WHEREAS:</Text>
          </View>
          <View>
            <Text style={styles.commonmargintopbottom}>
              A. On and subject to the terms and conditions contained herein,
              the Seller and the BUYER have agreed that the Seller shall sell to
              the BUYER, {data?.data?.quantity} ({data?.data?.quantity_in_words}
              ), from now on called “Sale shares”, at a sale price of Rs.
              {data?.data?.price}/- per share (
              {data?.data?.price_per_share_in_words} per share) (Sale Price)
              aggregating to a total sale consideration of Rs.
              {data?.data?.purchase_value}/- (
              {data?.data?.purchase_value_in_words}) (Sale Consideration);
            </Text>
          </View>
        </View>
        <View style={styles.marginbottom20}>
          <Text style={styles.marginTop}>
            B. This Agreement sets out the terms between the Parties hereto, and
            their rights and obligations concerning the sale of the said “Sale
            Shares” by the Seller. The purchase of the stated “Sale Shares” by
            the BUYER and other matters incidental in connection in addition to
            that.
          </Text>
        </View>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>1</Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text>The Parties Hereto Agree as follows:</Text>
        <Text style={styles.commonmargintopbottom}>
          <Text>1.</Text>{' '}
          <Text style={styles.textunderline}>
            Sale and Purchase of the Sale Shares{' '}
          </Text>
        </Text>
        <Text>
          On and subject to the terms and conditions contained herein, the
          Seller agrees to sell, transfer and deliver the Sale Shares to the
          BUYER and the BUYER agrees to purchase, acquire and accept the Sale
          Shares, free from all encumbrances for an aggregate Sale Consideration
          which Sale Consideration shall be payable by the BUYER to the Seller
          in the manner, on the terms and subject to the conditions contained in
          this Agreement.
        </Text>
        <Text style={styles.commonmargintopbottom}>
          Any corporate action accrued/announced by the Company on or before the
          date of completion of the transaction shall accrue to the Seller. The
          company&apos;s equity shares will be transferred Ex-dividend on the
          transaction&apos;s completion date.
        </Text>
        <Text>
          The sale consideration will be payable to the seller by the BUYER
          immediately on blocking the deal.{' '}
        </Text>
        <Text style={styles.commonmargintopbottom}>
          On transfer of the funds, the BUYER can request delivery of shares in
          his demat account at any point in time after paying documentation
          charges of Rs 20,000 (Twenty thousand only). This transfer will be
          subject to No objection approval from NSE.{' '}
        </Text>
        <Text>
          If NSE removes the documentation requirements and the associated costs
          of the transfer, the seller will initiate delivery of shares within 15
          days to the BUYER’s demat account.
        </Text>
        <Text style={styles.marginTop}>
          Pre Requisites for receiving delivery of NSE shares:
        </Text>
        <Text style={styles.marginleft30}>
          a. BUYER has to be a resident Indian.
        </Text>
        <Text style={styles.marginleft30}>
          b. BUYER should not be a direct trading member with NSE.
        </Text>
        <Text style={styles.commonmargintopbottom}>
          {' '}
          <Text>2.</Text>{' '}
          <Text style={styles.textunderline}>
            Representations and Warranties
          </Text>
        </Text>
        <Text>
          Both the Parties represent and warrant to the other Party that the
          statements contained in this Clause 3 (Representations And Warranties)
          (as may be applicable) are true and correct in all respects as on the
          date of this Agreement, and shall be true and correct in all respects
          as of the Completion Date.
        </Text>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>2</Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text>2.1 The Seller represents and warrants to the BUYER that:</Text>
        <Text style={styles.listtext}>
          a)The Seller is duly incorporated and validly existing and is
          authorised under relevant Applicable Laws to enter into this Agreement
          and perform and consummate the transaction envisaged herein.
        </Text>
        <Text style={styles.listtext}>
          b)It has full power and authority to enter this Agreement, perform its
          obligations herein, and consummate the contemplated transaction. This
          Agreement constitutes a legal, valid and binding obligation of the
          Seller, enforceable against the Seller under its terms.
        </Text>
        <Text style={styles.listtext}>
          c)It is the legal and beneficial owner of the Sale Shares, holds the
          Sale Shares free and clear of all encumbrances, and has the power and
          authority to sell and transfer the Sale Shares to the BUYER pursuant
          to this Agreement.
        </Text>
        <Text style={styles.marginTop}>
          2.2 The BUYER represents and warrants to the Seller that:
        </Text>
        <Text style={styles.listtext}>
          a)The BUYER is a real person. He is duly authorised to enter into this
          Agreement and is not authorised by any physical or mental instability
          and is otherwise not disqualified from entering into this Agreement,
          and that this Agreement has been signed and executed by him after
          having read and understood the terms contained therein, or the BUYER
          is an artificial/juristic person, it duly incorporated and is validly
          existing in India and is authorised under relevant Applicable Laws of
          India to enter into this Agreement and perform and consummate the
          transaction envisaged herein, as the case may be.
        </Text>
        <Text style={styles.listtext}>
          b)The BUYER has full power and authority to enter this Agreement,
          perform its obligations herein, and consummate the transaction
          contemplated now. This Agreement constitutes the BUYER&apos;s legal,
          valid and binding obligations, enforceable against the BUYER in
          accordance with its terms.
        </Text>
        <Text style={styles.listtext}>
          c)no restrictions are operating under any law on the BUYER to enter
          into this agreement and consummate the purchase of the “Sale shares”.{' '}
        </Text>
        <Text style={styles.listtext}>
          d)Any regulatory compliance, if applicable to the buyer, post the
          transaction is its responsibility, and it undertakes to comply with
          the same.
        </Text>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>3</Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text>
          <Text>3.</Text>
          <Text style={styles.underlineAndMargin}>Notices</Text>
        </Text>
        <Text style={styles.marginTopLeft}>
          3.1. Any notice or other communication given or made under this
          Agreement shall be in writing. Any such notice or other communication
          shall be addressed as provided in clause 4.2 below and, if so
          addressed, shall be deemed to have been duly given or made as follows:
        </Text>
        <Text style={styles.listtext}>
          a) If sent by personal delivery, upon delivery at the address of the
          relevant Party.
        </Text>
        <Text style={styles.listtext}>
          b)If sent by mail (with acknowledgement of receipt) two Business Days
          after the posting date.{' '}
        </Text>
        <Text style={styles.marginTop}>
          3.2. The relevant addressee, address and contact number of each Party
          for this Agreement is:
        </Text>
        <View style={styles.secondtable}>
          <View style={styles.tablefrstbox}>
            <Text style={styles.buyer}>NAME OF SELLER</Text>
            <Text></Text>
          </View>
          <View style={styles.tablesecbox}>
            <Text style={styles.buyer}>Address</Text>
          </View>
          <View style={styles.tablethirdbox}>
            <Text style={styles.buyer}>
              CONTACT PERSON / CONTACT NO. / EMAIL ID
            </Text>
          </View>
        </View>
        <View style={styles.secondchildtable}>
          <View style={styles.tablefrstchildbox}>
            <Text style={styles.buyer}>CHACE TECHNOLOGIES PVT LTD</Text>
            <Text></Text>
          </View>
          <View style={styles.tablesecchildbox}>
            <Text style={{ ...styles.contactheight, textAlign: 'center' }}>
              547/15, TAPASYA, 1ST FLOOR, A BLOCK, NEAR VI STORE, SAHAKARANAGAR,
              BENGALURU - 560092
            </Text>
          </View>
          <View style={styles.tablethirdchildbox}>
            <View style={styles.contactheight}>
              <Text style={styles.smallboxes}>Mr YOGESH AGRAWAL</Text>
              <Text style={styles.smallboxes}>+91 6262 6565 01</Text>
              <Text style={styles.textcenter}>
                yogesh.agrawal@joinleadoff.com
              </Text>
            </View>
          </View>
        </View>
        {/*  second table */}
        <View style={styles.secondtable}>
          <View style={styles.tablefrstbox}>
            <Text style={styles.buyer}>NAME OF BUYER</Text>
            <Text></Text>
          </View>
          <View style={styles.tablesecbox}>
            <Text style={styles.buyer}>Address</Text>
          </View>
          <View style={styles.tablethirdbox}>
            <Text style={styles.buyer}>
              CONTACT PERSON / CONTACT NO. / EMAIL ID
            </Text>
          </View>
        </View>
        <View style={styles.secondchildtable}>
          <View style={styles.tablefrstchildbox}>
            <Text style={styles.buyer}>
              {data?.data?.name_as_per_pan?.toUpperCase()}
            </Text>
            <Text></Text>
          </View>
          <View style={styles.tablesecchildbox}>
            <Text style={{ ...styles.contactheight, textAlign: 'center' }}>
              {data?.data?.address_as_per_aadhaar
                ?.replace(/\s/g, ' ')
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.tablethirdchildbox}>
            <View style={styles.contactheight}>
              <Text style={styles.smallboxes}>
                {' '}
                {data?.data?.name_as_per_pan?.toUpperCase()}
              </Text>
              <Text style={styles.smallboxes}>{data?.data?.mobile}</Text>
              <Text style={{ textAlign: 'center' }}>
                {data?.data?.email?.toLowerCase()}
              </Text>
            </View>
          </View>
        </View>
        <View></View>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>4</Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text>
          <Text>4.</Text>
          <Text style={styles.textunderline}>Miscellaneous</Text>
        </Text>
        <Text style={styles.numberlist}>
          4.1. Entire agreement: This Agreement sets out the entire terms &
          conditions and understanding between the Parties for the subject
          matter and supersedes all previous documents executed, and
          correspondence exchanged between any of the Parties hereto in
          connection with the transaction referred to herein, all of which shall
          not have any further force or effect.
        </Text>
        <Text style={styles.numberlist}>
          4.2. Counterparts: This Agreement may be executed in any number of
          counterparts by the Parties hereto, each of which shall be an original
          but all of which shall constitute the same instrument.
        </Text>
        <Text style={styles.numberlist}>
          4.3. Costs: The respective Parties shall bear their costs in
          connection with this Agreement and transaction thereof. The BUYER
          shall bear the stamp duty payable on this Agreement and stamp duty
          payable for the transfer of Sale Shares.
        </Text>
        <Text style={styles.underlineAndMargin}>
          <Text>5.</Text>
          <Text>Term and Termination</Text>
        </Text>
        <Text style={styles.marginTopLeft}>5.1.Termination</Text>
        <Text style={styles.numberlist}>
          5.1.1.This Agreement terminates automatically upon Completion of the
          transaction.
        </Text>
        <Text style={styles.numberlist}>
          5.1.2.This Agreement, except for clause 7, shall stand terminated. The
          transaction contemplated now abandoned without any obligation on any
          Party if Completion does not occur on or before the “Completion Date”
          as spelt out in clause 2.
        </Text>
        <Text style={styles.numberlist}>
          5.1.3.This agreement terminates automatically, without any obligation
          on any party, if NSE does not approve the buyer as fit and proper or
          directs the buyer to approach any other regulatory body like SEBI, RBI
          etc. for any kind of approval/clarification
        </Text>
        <Text style={styles.numberlist}>
          5.1.4.If NSE rejects the documentation for any reason, the Brokerage
          of the total sale value will be deducted. And the amount, excluding
          brokerage, will be refunded to the buyer within 15 Days from NSE
          Issuing any such notice.
        </Text>
        <Text style={styles.marginTopLeft}>5.2. Term</Text>
        <View style={styles.marginbottom20}>
          <Text style={styles.numberlist}>
            This Agreement shall come into effect from the Effective Date and
            shall remain valid and binding on the Parties until it is terminated
            by clause 6.2. If NSE rejects the transfer, the BUYER cannot get his
            holdings liquidated through the seller. The BUYER can arrange this
            counterparty for this sale, with the final authority resting with
            the BUYER.
          </Text>
        </View>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>5</Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text style={styles.underlineAndMargin}>
          <Text>6.</Text>
          <Text>Dispute Resolution</Text>
        </Text>
        <Text style={styles.numberlist}>
          6.1. Suppose any dispute, controversy or claim between the Parties
          hereto arises out of or in connection with this Agreement, including
          the breach, termination or invalidity thereof (Dispute). In that case,
          the parties hereto shall use all reasonable endeavours to negotiate to
          resolve the Dispute amicably. If a party gives the other party notice
          that a Dispute has arisen (a Dispute Notice) and the parties hereto
          cannot resolve the Dispute amicably within 15 days of service of the
          Dispute Notice (or a much more extended period as the Parties may
          mutually agree). The Dispute shall be referred to arbitration by the
          terms of clause 6.2 below.
        </Text>
        <Text style={styles.numberlist}>
          6.2. Subject to clause 6.1 above, any Dispute shall be referred to and
          finally resolved by arbitration, per the Arbitration and Conciliation
          Act, 1996. The Parties shall mutually appoint the arbitrators. Any
          arbitral award shall be final and binding on the Parties hereto, and
          the Parties waive irrevocably any rights to any form of appeal, review
          or recourse to any state or other judicial authority in so far as such
          waiver may validly be made. The venue of the arbitration shall be
          Bangalore, India. The language of the arbitration shall be English.
        </Text>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>6</Text>
        </View>
      </View>
      <View style={styles.pagepadding}>
        <Text>
          <Text>7.</Text>
          <Text style={styles.textunderline}>Confidentiality</Text>
        </Text>
        <Text style={styles.marginTop10}>
          Both Parties agree that the terms of this Agreement are confidential
          and are not disclosed to any third party without the mutual consent of
          the other Party.
        </Text>
        <Text style={styles.marginTop}>
          <Text>8.</Text>
          <Text style={styles.textunderline}>
            Governing Law and Jurisdiction
          </Text>
        </Text>
        <Text style={styles.marginTop10}>
          This Agreement and the relationship between the Parties hereto shall
          be governed by and interpreted under the laws of India without regard
          to the conflict of law provisions thereof. Subject to Clause 7
          (Dispute Resolution), the courts at Kolkata, India, shall have
          exclusive jurisdiction over all matters arising from this Agreement.
        </Text>
        <Text style={styles.marginTop10}>
          Any statutory reporting, if required, shall be made by the Parties. As
          Witness, this Agreement has been signed by the duly authorised
          representatives of the parties hereto as of the day and year first
          before written.
        </Text>
        <View style={styles.flexdiv}>
          <View style={styles.flexcol}>
            <Text>SIGNED BY THE SELLER </Text>
            {data?.data?.isUnsigned ? (
              <Text style={styles.image}></Text>
            ) : (
              <Image
                style={styles.image}
                src={
                  'https://chace-pe-assets.s3.us-east-2.amazonaws.com/Leadoff/agreement/signature-image.png'
                }
              />
            )}
            <Text>YOGESH AGRAWAL</Text>
          </View>
          <View style={styles.flexcol}>
            <Text>SIGNED BY THE BUYER </Text>
            {data?.data?.isUnsigned ? (
              <Text style={styles.image}></Text>
            ) : (
              <Image style={styles.image} src={data?.data?.signature_image} />
            )}
            <Text>{data?.data?.name_as_per_pan?.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.firstpagehrline}>
          <Text style={styles.marginleft95per}>7</Text>
        </View>
      </View>
    </Page>
  </Document>
)

function NSEInvoice(data) {
  return (
    <PDFDownloadLink
      document={<MyDocument data={data} />}
      fileName={`Precize_${data?.data?.gui_order_id}_${data?.data?.payment_date}_${data?.data?.symbol}.pdf`}
      style={{
        color: 'white',
      }}
    >
      <Button
        type="button"
        variant="outline"
        className={
          data?.data?.isUnsigned
            ? 'text-orange-500 border-orange-500 hover:bg-orange-100'
            : 'text-blue-500 border-blue-500 hover:bg-blue-100'
        }
      >
        {`Download ${data?.data?.isUnsigned ? 'Unsigned' : 'Signed'} Agreement`}
      </Button>
    </PDFDownloadLink>
  )
}

export default NSEInvoice
