import {
  Building2,
  Phone,
  Mail,
  Globe,
  Award,
  Wrench,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "@/assets/logo.jpg";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 flex flex-col items-center">
        <img src={Logo} alt="Logo" style={{ maxHeight: "120px" }} />
        <h1 className="text-3xl font-bold text-foreground">
          CÔNG TY TNHH TDMK
        </h1>
        <p className="text-muted-foreground text-lg italic">
          Được thành lập từ năm 2016
        </p>
      </div>
      <Separator />
      {/* Giới thiệu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Giới thiệu chung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Công ty TNHH TDMK</strong> được
            biết đến là một trong những công ty đi đầu trong lĩnh vực cung cấp
            thiết bị và giải pháp trong lĩnh vực đo lường tại Việt Nam. Chúng
            tôi là Đại diện ủy quyền chính hãng của các thương hiệu nổi tiếng
            trên thế giới như: dòng thiết bị data logger Graphtec, thiết bị đo
            lường HIOKI, AC/DC Power Supply của Itech…
          </p>
          <p>
            <strong className="text-foreground">Công ty TDMK</strong> ngày càng
            khẳng định vị thế hàng đầu của mình trong việc cung cấp thiết bị với
            nhiều năm kinh nghiệm cùng đội ngũ nhân viên giàu năng lực.
          </p>
        </CardContent>
      </Card>
      {/* Điểm mạnh */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center">
          <CardContent className="pt-6 space-y-2">
            <Award className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-bold text-foreground">Sản phẩm chính hãng</h3>
            <p className="text-sm text-muted-foreground">
              Đại diện ủy quyền các thương hiệu hàng đầu thế giới
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6 space-y-2">
            <Wrench className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-bold text-foreground">
              Dịch vụ hậu mãi tuyệt vời
            </h3>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ kỹ thuật chuyên nghiệp và tận tâm
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6 space-y-2">
            <Clock className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-bold text-foreground">Thủ tục nhanh chóng</h3>
            <p className="text-sm text-muted-foreground">
              Quy trình đơn giản, giao hàng nhanh chóng
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Giải pháp */}
      <Card>
        <CardHeader>
          <CardTitle>Các giải pháp của chúng tôi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              SPC – Statistical Process Control
            </h4>
            <p>
              Giải pháp số hóa và tự động hóa quy trình quản lý dữ liệu trong
              nhà máy. Thu thập toàn bộ dữ liệu đo lường từ tất cả các thiết bị
              theo thời gian thực và quản lý tập trung trên hệ thống cloud.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Vision Inspection (AI + Deep Learning)
            </h4>
            <p>
              Giải pháp kiểm tra ngoại quan sản phẩm ứng dụng công nghệ Vision,
              kết hợp AI và Deep Learning để phát hiện và đánh giá các yêu cầu
              về ngoại quan sản phẩm.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Liên hệ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span>Mr. Hào: 097 775 3665</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span>Mr. Hoàng: 094 187 0245</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-primary shrink-0" />
            <a
              href="https://tdmk.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://tdmk.vn
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AboutUs;
